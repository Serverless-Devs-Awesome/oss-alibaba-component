'use strict'

const {Log} = require('@serverless-devs/s-core')
const OssClient = require('../services/oss')
// const {
//   AddCdnDomain, DescribeUserDomains, UpdateTagResources, DescribeCdnDomainConfigs, SetCdnDomainConfig,
//   DeleteSpecificConfig, SetDomainServerCertificate, DescribeCdnCertificateList,
// } = require('../oss/cdn')

const log = new Log()

// TODO check param for each config
const remove = async (inputParams) => {
    const {
        credentials, state, args, bucket, region
    } = inputParams
    const oss = new OssClient(credentials, region, bucket)

    log.info('Getting objects ...')
    const objects = await oss.listObject(bucket)

    if (objects.length > 0) {
        log.info('Deleting objects ...')
        await oss.deleteObjects(objects)
    }

    log.info('Getting version objects ...')
    const versionObjects = await oss.getBucketVersions()
    if (versionObjects.length > 0) {
        log.info('Deleting version objects ...')
        await oss.deleteObjects(versionObjects)
    }

    // console.log(await oss.getBucketVersions())

    log.info('Oss config removing...')
    await oss.deleteBucket(bucket)
}


module.exports = {
    removeImpl: remove
}
