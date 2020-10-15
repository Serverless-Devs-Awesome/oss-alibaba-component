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

const doConfig = async(inputParams) => {
  const oss = new OssClient(inputParams.credentials, inputParams.region, "")
  let bucket = inputParams.bucket
  let bucketInfo = await oss.getBucketInfo(bucket)
  if (bucketInfo) {
    // console.log(bucketInfo)
  } else {
    console.log(red(`the specified bucket '${bucket}' doesn't exist, create it now`))
    const options = {
      storageClass: inputParams.StorageClass, // 存储空间的默认存储类型为标准存储，即Standard。如果需要设置存储空间的存储类型为归档存储，请替换为Archive。
      acl: inputParams.Acl, // 存储空间的默认读写权限为私有，即private。如果需要设置存储空间的读写权限为公共读，请替换为public-read。
      dataRedundancyType: inputParams.DataRedundancyType // 存储空间的默认数据容灾类型为本地冗余存储，即LRS。如果需要设置数据容灾类型为同城冗余存储，请替换为ZRS。
    }
    await oss.putBucket(bucket, options)
  }
}

const doObject = async(inputParams) => {

}

module.exports = {
  deployImpl: deploy
}
