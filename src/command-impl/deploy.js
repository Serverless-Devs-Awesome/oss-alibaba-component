'use strict'

const fs = require('fs-extra')
const path = require('path')
const {Log} = require("@serverless-devs/s-core")
const OssClient = require('../services/oss')

const log = new Log()

const endpoint = {
    "cn-hangzhou": {
        "endpoint": "oss-cn-hangzhou.aliyuncs.com",
        "internalEndpoint": "oss-cn-hangzhou-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-shanghai": {
        "endpoint": "oss-cn-shanghai.aliyuncs.com",
        "internalEndpoint": "oss-cn-shanghai-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-qingdao": {
        "endpoint": "oss-cn-qingdao.aliyuncs.com",
        "internalEndpoint": "oss-cn-qingdao-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-zhangjiakou": {
        "endpoint": "oss-cn-zhangjiakou.aliyuncs.com",
        "internalEndpoint": "oss-cn-zhangjiakou-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-beijing": {
        "endpoint": "oss-cn-beijing.aliyuncs.com",
        "internalEndpoint": "oss-cn-beijing-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-wulanchabu": {
        "endpoint": "oss-cn-wulanchabu.aliyuncs.com",
        "internalEndpoint": "oss-cn-wulanchabu-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-huhehaote": {
        "endpoint": "oss-cn-huhehaote.aliyuncs.com",
        "internalEndpoint": "oss-cn-huhehaote-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-shenzhen": {
        "endpoint": "oss-cn-shenzhen.aliyuncs.com",
        "internalEndpoint": "oss-cn-shenzhen-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-guangzhou": {
        "endpoint": "oss-cn-guangzhou.aliyuncs.com",
        "internalEndpoint": "oss-cn-guangzhou-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-chengdu": {
        "endpoint": "oss-cn-chengdu.aliyuncs.com",
        "internalEndpoint": "oss-cn-chengdu-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "cn-hongkong": {
        "endpoint": "oss-cn-hongkong.aliyuncs.com",
        "internalEndpoint": "oss-cn-hongkong-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "us-west-1": {
        "endpoint": "oss-us-west-1.aliyuncs.com",
        "internalEndpoint": "us-west-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "ap-southeast-1": {
        "endpoint": "oss-oss-ap-southeast-1.aliyuncs.com",
        "internalEndpoint": "oss-oss-ap-southeast-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "ap-southeast-2": {
        "endpoint": "oss-oss-ap-southeast-2.aliyuncs.com",
        "internalEndpoint": "oss-oss-ap-southeast-2-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "ap-southeast-3": {
        "endpoint": "oss-ap-southeast-3.aliyuncs.com",
        "internalEndpoint": "oss-ap-southeast-3-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "ap-northeast-1": {
        "endpoint": "oss-ap-northeast-1.aliyuncs.com",
        "internalEndpoint": "oss-northeast-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "ap-south-1": {
        "endpoint": "oss-ap-south-1.aliyuncs.com",
        "internalEndpoint": "oss-ap-south-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "eu-central-1": {
        "endpoint": "oss-eu-central-1.aliyuncs.com",
        "internalEndpoint": "oss-eu-central-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "eu-west-1": {
        "endpoint": "oss-eu-west-1.aliyuncs.com",
        "internalEndpoint": "oss-eu-west-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    },
    "me-east-1": {
        "endpoint": "oss-me-east-1.aliyuncs.com",
        "internalEndpoint": "oss-me-east-1-internal.aliyuncs.com",
        "globalAccelerate": "oss-accelerate.aliyuncs.com",
        "globalAccelerateOverseas": "oss-accelerate-overseas.aliyuncs.com"
    }
}

// TODO check param for each config
const deploy = async (inputParams) => {

    const {args} = inputParams

    const commands = args.Commands || []

    if (commands.includes('config') || commands.length == 0) {
        log.info('Updating config')
        await doConfig(inputParams)
    }
    if (commands.includes('object') || commands.length == 0) {
        log.info('Updating object')
        await doObject(inputParams)
    }

    return {
        "Region": inputParams.region,
        "Bucket": inputParams.bucket,
        "Endpoint": {
            "Publish": endpoint[inputParams.region]["endpoint"],
            "Internal": endpoint[inputParams.region]["internalEndpoint"]
        },
        "Accelerate": {
            "Global": endpoint[inputParams.region]["globalAccelerate"],
            "Overseas": endpoint[inputParams.region]["globalAccelerateOverseas"]
        },
    }
}

const doObject = async (params) => {

    let codeUri = params.codeUri
    if (isParamsExist(codeUri)) {
        log.log(`Uploading object...`)

        let prefix
        let localDir
        let excludes
        let includes
        if(typeof codeUri == "string"){
            prefix = ""
            localDir = codeUri
            excludes = []
        }else{

            prefix = codeUri.Prefix || ""

            includes = []
            const tempIncludes = codeUri.Includes || []
            for (const i of tempIncludes) {
                includes.push({
                    file: i,
                    target: prefix,
                    local: path.resolve(i)
                })
            }

            excludes = []
            const tempExcludes = codeUri.Excludes || []
            for (const e of tempExcludes) {
                excludes.push(e)
            }

            localDir = codeUri.Src
        }

        localDir = path.resolve(localDir)
        const oss = new OssClient(params.credentials, params.region, params.bucket)
        await oss.uploadFiles(prefix, localDir, excludes, includes)
    }
}

const doConfig = async (params) => {

    const oss = new OssClient(params.credentials, params.region, params.bucket)
    let bucket = params.bucket

    const {Parameters: parameters = {}} = params.args
    const {tag, cors, referer, acl, lifecycle, logging, encryption, versioning, website} = parameters
    const deployAll = Object.keys(parameters).length==0

    // ensure bucket exist
    let bucketInfo = await oss.getBucketInfo(bucket)
    if (bucketInfo) {
    } else {
        log.warn(`The specified bucket '${bucket}' doesn't exist, creating it now`)
        const options = {}
        if(params.storageClass){
            options.storageClass = params.storageClass
        }
        if(params.acl){
            options.acl = params.acl
        }
        if(params.dataRedundancyType){
            options.dataRedundancyType = params.dataRedundancyType
        }
        await oss.putBucket(bucket, options)
    }

    // tags
    if(tag || deployAll){
        let tagsList = params.tags
        if (isParamsExist(tagsList)) {
            log.log("Setting tags ...")
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
    }


    // CORS
    if(cors || deployAll) {
        let cors = params.cors
        if (isParamsExist(cors)) {
            log.log("Setting cors ...")
            let options = convertObjectKey(cors)
            await oss.deleteBucketCORS(bucket)
            await oss.putBucketCORS(bucket, options)
        } else {
            await oss.deleteBucketCORS(bucket)
        }
    }

    // Referer
    if(referer || deployAll) {
        let referer = params.referer
        if (isParamsExist(referer)) {
            log.log("Setting referer ...")
            await oss.putBucketReferer(bucket, referer.AllowEmptyReferer, referer.List)
        } else {
            await oss.deleteBucketReferer(bucket)
        }
    }

    // acl
    if(acl || deployAll) {
        if (params.acl) {
            log.log("Setting acl ...")
            await oss.putBucketACL(bucket, params.acl)
        } else {
            await oss.putBucketACL(bucket, "private")
        }
    }
    // lifecycle
    if(lifecycle || deployAll) {
        if (isParamsExist(params.lifecycle)) {
            log.log("Setting lifecycle ...")
            let lifecycle = []
            for (const lc of params.lifecycle) {
                lifecycle.push(convertObjectKey(lc))
            }
            await oss.deleteBucketLifecycle(bucket)
            await oss.putBucketLifecycle(bucket, lifecycle)
        } else {
            await oss.deleteBucketLifecycle(bucket)
        }
    }

    // logging
    if(logging || deployAll) {
        let logging = params.logging
        if (validateBoolParam(logging.Enable)) {
            log.log("Setting logging ...")
            if (logging.Enable === true) {
                await oss.putBucketLogging(bucket, logging.TargetPrefix)
            } else {
                await oss.deleteBucketLogging(bucket)
            }
        } else {
            throw new Error(`parameter invalid for logging, logging.Enable: ${logging.Enable} invalid`)
        }
    }

    // encryption
    if(encryption || deployAll) {
        let encryption = params.encryptionRule
        if (isParamsExist(encryption)) {
            log.log("Setting encryption ...")
            await oss.putBucketEncryption(bucket, encryption)
        } else {
            await oss.deleteBucketEncryption(bucket)
        }
    }

    // version
    if(versioning || deployAll) {
        let versioning = params.versioning
        if (validateEnabledParam(versioning)) {
            log.log("Setting version ...")
            if (versioning === "enable") {
                await oss.putBucketVersioning(bucket, "Enabled")
            } else {
                await oss.putBucketVersioning(bucket, "Suspended")
            }
        } else {
            throw new Error(`Invalid versioning parameter: ${JSON.stringify(versioning)}`)
        }
    }

    // website
    if(website || deployAll) {
        let website = params.website
        if (isParamsExist(website)) {
            log.log("Setting website ...")
            website = convertObjectKey(params.website)
            // console.log(JSON.stringify(params.website))
            await oss.putBucketWebsite(bucket, website)
        } else {
            await oss.deleteBucketWebsite(bucket)
        }
    }

}

function convertObjectKey(obj) {
    if (typeof obj == 'object' && obj.constructor === Array) {
        for (let i = 0; i < obj.length; i++) {
            if (typeof (obj[i]) === 'object') {
                obj[i] = convertObjectKey(obj[i])
            }
        }
        return obj
    } else {
        if (typeof (obj) === 'object') {
            for (var key in obj) {
                if (typeof (obj[key]) === 'object') {
                    obj[key] = convertObjectKey(obj[key])
                }
                obj[key.substring(0, 1).toLowerCase() + key.substring(1)] = obj[key];
                delete (obj[key]);
            }
            return obj;
        }
    }
}

function isParamsExist(params) {
    return JSON.stringify(params) !== "{}"
}

function validateEnabledParam(params) {
    return JSON.stringify(params) === "{}" || typeof (params) === "undefined" || !params || (params === "enable" || params === "disable")
}

function validateBoolParam(params) {
    return JSON.stringify(params) === "{}" || typeof (params) === "undefined" || !params || (params === true || params === false)
}


module.exports = {
    deployImpl: deploy
}
