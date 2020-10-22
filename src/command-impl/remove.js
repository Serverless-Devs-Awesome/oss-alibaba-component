'use strict'

const { green, yellow, blue, red} = require('colors')
const OssClient = require('../services/oss')
// const {
//   AddCdnDomain, DescribeUserDomains, UpdateTagResources, DescribeCdnDomainConfigs, SetCdnDomainConfig,
//   DeleteSpecificConfig, SetDomainServerCertificate, DescribeCdnCertificateList,
// } = require('../oss/cdn')

// TODO check param for each config
const remove = async (inputParams) => {
  const {
    credentials, state, args, bucket, region
  } = inputParams
  const oss = new OssClient(credentials, region, "")

  console.log(red('oss config removing...'))
  await oss.deleteBucket(bucket)
}


module.exports = {
  removeImpl : remove
}
