'use strict'

const fs = require('fs-extra')
const path = require('path')
const { green, yellow, blue, red} = require('colors')
const OssClient = require('../services/oss')
// const {
//   AddCdnDomain, DescribeUserDomains, UpdateTagResources, DescribeCdnDomainConfigs, SetCdnDomainConfig,
//   DeleteSpecificConfig, SetDomainServerCertificate, DescribeCdnCertificateList,
// } = require('../oss/cdn')

// TODO check param for each config
const deploy = async (inputParams) => {
  const {
    credentials, args,
    region, bucket, codeUri, tags, storageClass,
    cors, referer, acl, lifecycle, policy, logging,
    encryptionRule, versioning, domains, website
  } = inputParams

  const { Parameters: parameters = {} } = args
  const { config, object} = parameters

  if (config && object || (!config && !object)) {
    console.log('deploy with config and object')
    await doConfig(inputParams)
    await doObject(inputParams)
  } else if (config) {
    console.log('deploy with config')
    await doConfig(inputParams)
  } else if (object) {
    console.log('deploy with object')
    await doObject(inputParams)
  }

}

const doConfig = async(params) => {
  const oss = new OssClient(params.credentials, params.region, "")
  let bucket = params.bucket
  // ensure bucket exist
  let bucketInfo = await oss.getBucketInfo(bucket)
  if (bucketInfo) {
    // console.log(bucketInfo)
  } else {
    console.log(red(`the specified bucket '${bucket}' doesn't exist, create it now`))
    const options = {
      storageClass: params.storageClass, // 存储空间的默认存储类型为标准存储，即Standard。如果需要设置存储空间的存储类型为归档存储，请替换为Archive。
      acl: params.acl, // 存储空间的默认读写权限为私有，即private。如果需要设置存储空间的读写权限为公共读，请替换为public-read。
      dataRedundancyType: params.dataRedundancyType // 存储空间的默认数据容灾类型为本地冗余存储，即LRS。如果需要设置数据容灾类型为同城冗余存储，请替换为ZRS。
    }
    await oss.putBucket(bucket, options)
  }

  // tags
  await oss.deleteBucketTags(bucket)
  let tagsList = params.tags
  let tags = {}
  for (const t of tagsList) {
    tags[t.Key] = t.Value
  }
  // console.log(tags)
  await oss.putBucketTags(bucket, tags)

  // CORS
  await oss.deleteBucketCORS(bucket)
  let options = convertObjectKey(params.cors)
  await oss.putBucketCORS(bucket, options)

  // Referer
  await oss.deleteBucketReferer(bucket)
  await oss.putBucketReferer(bucket, params.referer.AllowEmptyReferer, params.referer.List)

  // acl
  await oss.putBucketACL(bucket, params.acl)

  // lifecycle
  let lifecycle = []
  for (const lc of params.lifecycle) {
    lifecycle.push(convertObjectKey(lc))
  }
  console.log(JSON.stringify(lifecycle))
  await oss.deleteBucketLifecycle(bucket)
  await oss.putBucketLifecycle(bucket, lifecycle)

  // logging
  let logging = params.logging
  await oss.deleteBucketLogging(bucket)
  if (logging.Enable === true) {
    await oss.putBucketLogging(bucket, logging.TargetPrefix)
  }

  // encryption
  let encryption = params.encryptionRule
  if (encryption) {
    await oss.putBucketEncryption(bucket, encryption)
  } else {
    await oss.deleteBucketEncryption(bucket)
  }

  // version
  let versioning = params.versioning
  if (versioning) {
    if (versioning && versioning === "enable") {
      await oss.putBucketVersioning(bucket, "Enabled")
    } else if (versioning && versioning === "disable") {
      await oss.putBucketVersioning(bucket, "Suspended")
    } else {
      console.log(red(`invalid versioning parameter: ${versioning}`))
    }
  } else {
    await oss.putBucketVersioning(bucket, "Suspended")
  }
}

const doObject = async(inputParams) => {

}

function convertObjectKey(obj) {
  if (typeof obj == 'object' && obj.constructor === Array) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof(obj[i]) === 'object') {
        obj[i] = convertObjectKey(obj[i])
      }
    }
    return obj
  } else {
    if(typeof(obj) === 'object'){
      for (var key in obj){
        if (typeof(obj[key]) === 'object') {
          obj[key] = convertObjectKey(obj[key])
        }
        obj[key.substring(0,1).toLowerCase()+key.substring(1)] = obj[key];
        delete(obj[key]);
      }
      return obj;
    }
  }
}

module.exports = {
  deployImpl: deploy
}
