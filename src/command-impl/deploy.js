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
  let tagsList = params.tags
  if (isParamsExist(tagsList)) {
    let tags = {}
    for (const t of tagsList) {
      tags[t.Key] = t.Value
    }
    // console.log(tags)
    await oss.deleteBucketTags(bucket)
    await oss.putBucketTags(bucket, tags)
  } else {
    await oss.deleteBucketTags(bucket)
  }

  // CORS
  let cors = params.cors
  if (isParamsExist(cors)) {
    let options = convertObjectKey(cors)
    await oss.deleteBucketCORS(bucket)
    await oss.putBucketCORS(bucket, options)
  } else {
    await oss.deleteBucketCORS(bucket)
  }

  // Referer
  let referer = params.referer
  if (isParamsExist(referer)) {
    await oss.deleteBucketReferer(bucket)
    await oss.putBucketReferer(bucket, referer.AllowEmptyReferer, referer.List)
  } else {
    await oss.deleteBucketReferer(bucket)
  }

  // acl
  if (isParamsExist(params.acl)) {
    await oss.putBucketACL(bucket, params.acl)
  } else {
    await oss.putBucketACL(bucket, "private")
  }

  // lifecycle
  if (isParamsExist(params.lifecycle)) {
    let lifecycle = []
    for (const lc of params.lifecycle) {
      lifecycle.push(convertObjectKey(lc))
    }
    // console.log(JSON.stringify(lifecycle))
    await oss.deleteBucketLifecycle(bucket)
    await oss.putBucketLifecycle(bucket, lifecycle)
  } else {
    await oss.deleteBucketLifecycle(bucket)
  }

  // logging
  let logging = params.logging
  if (isParamsExist(logging)) {
    if (validateBoolParam(logging.Enable)){
      if (logging.Enable === true) {
        await oss.putBucketLogging(bucket, logging.TargetPrefix)
      } else {
        await oss.deleteBucketLogging(bucket)
      }
    } else {
      console.log(red(`parameter invalid for logging, logging.Enable: ${logging.Enable} invalid`))
    }
  } else {
    await oss.deleteBucketLogging(bucket)
  }

  // encryption
  let encryption = params.encryptionRule
  if (isParamsExist(encryption)) {
    await oss.putBucketEncryption(bucket, encryption)
  } else {
    await oss.deleteBucketEncryption(bucket)
  }

  // version
  let versioning = params.versioning
  if (isParamsExist(versioning)) {
    if (validateEnabledParam(versioning)) {
      if (versioning === "enable") {
        await oss.putBucketVersioning(bucket, "Enabled")
      } else if (versioning === "disable") {
        await oss.putBucketVersioning(bucket, "Suspended")
      }
    } else {
      console.log(red(`invalid versioning parameter: ${versioning}`))
    }
  } else {
    await oss.putBucketVersioning(bucket, "Suspended")
  }

  // website
  let website = params.website
  if (isParamsExist(website)) {
    website = convertObjectKey(params.website)
    // console.log(JSON.stringify(params.website))
    await oss.putBucketWebsite(bucket, website)
  } else {
    await oss.deleteBucketWebsite(bucket)
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

function isParamsExist(params) {
  return JSON.stringify(params) !== "{}"
}

function validateEnabledParam(params) {
  return !params || (params === "enable" || params === "disable")
}

function validateBoolParam(params) {
  return !params || (params === true || params === false)
}


module.exports = {
  deployImpl: deploy
}
