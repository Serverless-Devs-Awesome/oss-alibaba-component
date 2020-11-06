const Oss = require('ali-oss')
const fs = require('fs')
const path = require('path')
const {Log} = require("@serverless-devs/s-core")

class OssClient {
    constructor(credentials, region, bucketName) {
        this.uploaded = []
        this.log = new Log()
        this.ossClient = new Oss({
            region: 'oss-' + region,
            accessKeyId: credentials.AccessKeyID,
            accessKeySecret: credentials.AccessKeySecret,
            bucket: bucketName
        })
    }

    async getBucketInfo(bucketName) {
        // console.log(bucketName)
        try {
            return await this.ossClient.getBucketInfo(bucketName)
        } catch (error) {
            // 指定的存储空间不存在。
            if (error.name !== 'NoSuchBucketError') {
            }
        }
    }

    // 创建存储空间
    async putBucket(bucketName, options) {
        try {
            await this.ossClient.putBucket(bucketName, options)
        } catch (err) {
            throw new Error(err)
        }
    }

    async deleteBucket(bucketName) {
        try {
            const result = await this.ossClient.deleteBucket(bucketName)
            // console.log(result)
        } catch (err) {
            if (err.code === "BucketNotEmpty") {
                this.log.error("The bucket you tried to delete is not empty.")
            } else {
                throw new Error(err)
            }
        }
    }

    async listObject() {
        const result = []
        let nextToken = null
        try {
            while (true) {
                let tempResult
                if (nextToken) {
                    tempResult = await this.ossClient.list({
                        marker: nextToken
                    })
                } else {
                    tempResult = await this.ossClient.list()
                    nextToken = tempResult.nextMarker
                }
                if (tempResult.objects) {
                    for (let i = 0; i < tempResult.objects.length; i++) {
                        result.push(tempResult.objects[i].name)
                    }
                }
                if (!tempResult.objects || tempResult.objects.length < 1000) {
                    break
                }
            }
            return result
        } catch (err) {
            throw new Error(err)
        }
    }

    // 获取版本文件
    async getBucketVersions() {
        const result = []
        let nextToken = null
        try {
            while (true) {
                let tempResult
                if (nextToken) {
                    tempResult = await this.ossClient.list({
                        marker: nextToken
                    })
                } else {
                    tempResult = await this.ossClient.getBucketVersions()
                    nextToken = tempResult.nextMarker
                }
                if (tempResult.deleteMarker) {
                    for (let i = 0; i < tempResult.deleteMarker.length; i++) {
                        result.push({
                            key: tempResult.deleteMarker[i].name,
                            versionId: tempResult.deleteMarker[i].versionId
                        })
                    }
                }
                if (!tempResult.deleteMarker || tempResult.deleteMarker.length < 1000) {
                    break
                }
            }
            return result
        } catch (err) {
            throw new Error(err)
        }
    }


    // 删除文件
    async deleteObjects(objects) {
        try {
            await this.ossClient.deleteMulti(objects);
        } catch (e) {
            throw new Error(e)
        }
    }

    // 设置Bucket标签
    async putBucketTags(bucketName, tag) {
        try {
            await this.ossClient.putBucketTags(bucketName, tag)
        } catch (e) {
            throw new Error(e)
        }
    }

    //获取Bucket标签
    async getBucketTags(bucketName) {
        try {
            this.log.log(`Getting ${bucketName}'s tags ...`)
            await this.ossClient.getBucketTags(bucketName)
            this.log.log(`Getted ${bucketName}'s tags success`)
        } catch (e) {
            throw new Error(e)
        }
    }

    // 删除Bucket标签
    async deleteBucketTags(bucketName) {
        try {
            this.log.log(`Deleting ${bucketName}'s tags ...`)
            await this.ossClient.deleteBucketTags(bucketName)
            this.log.log(`Deleted ${bucketName}'s tags success`)
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketCORS(bucket, options) {
        try {
            await this.ossClient.putBucketCORS(bucket, options).then((result) => {
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketCORS(bucket) {
        try {
            await this.ossClient.deleteBucketCORS(bucket)
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketReferer(bucket, allowEmptyReferer, options) {
        try {
            let result = await this.ossClient.putBucketReferer(bucket, allowEmptyReferer, options)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getBucketReferer(bucket) {
        try {
            let result = await this.ossClient.getBucketReferer(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketReferer(bucket) {
        try {
            let result = await this.ossClient.deleteBucketReferer(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketACL(bucket, acl) {
        // 此处以创建Bucket后修改其访问权限为private为例。
        try {
            await this.ossClient.putBucketACL(bucket, acl)
        } catch (e) {
            throw new Error(e)
        }
    }

    // 获取存储空间的访问权限
    async getBucketAcl(bucket) {
        try {
            const result = await this.ossClient.getBucketACL(bucket)
            return result.acl
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketLifecycle(bucket, options) {
        try {
            return await this.ossClient.putBucketLifecycle(bucket, options)
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketLifecycle(bucket) {
        try {
            return await this.ossClient.deleteBucketLifecycle(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketLogging(bucket, prefix) {
        try {
            let result = await this.ossClient.putBucketLogging(bucket, prefix)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getBucketLogging(bucket) {
        try {
            let result = await this.ossClient.getBucketLogging(bucket)
            console.log(JSON.stringify(result.res.data.toString()))
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketLogging(bucket) {
        try {
            let result = await this.ossClient.deleteBucketLogging(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async putBucketEncryption(bucket, options) {
        try {
            // 配置Bucket加密方式
            let result = await this.ossClient.putBucketEncryption(bucket, options)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getBucketEncryption(bucket) {
        try {
            let result = await this.ossClient.getBucketEncryption(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketEncryption(bucket) {
        try {
            //删除Bucket的加密配置。
            let result = await this.ossClient.deleteBucketEncryption(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    // 设置存储空间版本控制状态为Enabled或Suspended
    async putBucketVersioning(bucket, status) {
        const options = {
            "status": status,
        } // `Enabled` or `Suspended`
        const result = await this.ossClient.putBucketVersioning(bucket, status)
        // console.log(result)
    }

    async putBucketWebsite(bucket, options) {
        try {
            let result = await this.ossClient.putBucketWebsite(bucket, options)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getBucketWebsite(bucket) {
        try {
            let result = await this.ossClient.getBucketWebsite(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteBucketWebsite(bucket) {
        try {
            let result = await this.ossClient.deleteBucketWebsite(bucket)
            // console.log(result)
        } catch (e) {
            throw new Error(e)
        }
    }


    async uploadFile(target, local, excludes) {
        try {
            this.log.log(`Uploading to oss ${target} ...`)
            let upload = true
            for (const e of excludes) {
                const tempPath = path.resolve(e)
                if (local.indexOf(tempPath) === 0) {
                    upload = false
                }
            }
            if (upload == false) {
                for (const e of this.includes) {
                    const tempPath = path.resolve(e.file)
                    target = path.join(e.target, local == e.local ? path.basename(e.local) : local.replace(e.local, ""))
                    if (local.indexOf(tempPath) === 0) {
                        upload = true
                    }
                }
            }
            if (upload) {
                await this.ossClient.put(target, local)
                this.log.log(`Uploaded to oss ${local} -> ${target} succeed`)
            } else {
                this.log.log(`Ignore  ${local}`)
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async uploadFiles(objectPrefix, localDir, excludes, includes) {
        let docs = fs.readdirSync(localDir)
        if (includes) {
            for (let i = 0; i < includes.length; i++) {
                docs.push(includes[i].file)
            }
            this.includes = includes
            // docs = docs.concat(includes)
        }
        for (const doc of docs) {
            let localPath = path.resolve(localDir, doc)
            let targetPath = objectPrefix + '/' + doc
            let st = fs.statSync(localPath)
            // 判断是否为文件
            if (st.isFile()) {
                if (!this.uploaded.includes(localPath)) {
                    await this.uploadFile(targetPath, localPath, excludes)
                    this.uploaded.push(localPath)
                }
            } else if (st.isDirectory()) {
                await this.uploadFiles(targetPath, localPath, excludes)
            }
        }

    }
}

module.exports = OssClient
