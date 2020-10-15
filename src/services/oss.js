const Oss = require('ali-oss')

class OssClient {
  constructor (credentials, region, bucketName) {
    // if (!bucketName) {
    //   this.ossClient = new Oss({
    //     region: 'oss-' + region,
    //     accessKeyId: credentials.AccessKeyID,
    //     accessKeySecret: credentials.AccessKeySecret,
    //     timeout: 30 * 1000
    //   })
    // }

    this.ossClient = new Oss({
      region: 'oss-' + region,
      accessKeyId: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      bucket: bucketName
    })
  }

  async getBucketInfo(bucketName) {
    console.log(bucketName)
    try {
      return await this.ossClient.getBucketInfo(bucketName)
    } catch (error) {
      // 指定的存储空间不存在。
      if (error.name !== 'NoSuchBucketError') {
        console.log(error)
      }
    }
  }

  // 创建存储空间
  async putBucket(bucketName, options) {
    try {
      await this.ossClient.putBucket(bucketName, options)
    } catch (err) {
      console.log(err)
    }
  }

  // 设置Bucket标签
  async putBucketTags(bucketName, tag) {
    try {
      let result = await this.ossClient.putBucketTags(bucketName, tag)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  //获取Bucket标签
  async getBucketTags(bucketName) {
    try {
      let result = await this.ossClient.getBucketTags(bucketName)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  // 删除Bucket标签
  async deleteBucketTags(bucketName) {
    try {
      let result = await this.ossClient.deleteBucketTags(bucketName)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async uploadFile (filePath, object) {
    await this.ossClient.put(object, filePath)
  }


  async putBucketCORS (bucket, options) {
    try {
      await this.ossClient.putBucketCORS(bucket, options).then((result) => {})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteBucketCORS(bucket) {
    try {
      await this.ossClient.deleteBucketCORS(bucket)
    } catch (e) {
      console.log(e)
    }
  }

  async putBucketReferer(bucket, allowEmptyReferer, options) {
    try {
      let result = await this.ossClient.putBucketReferer(bucket, allowEmptyReferer, options)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async getBucketReferer(bucket) {
    try {
      let result = await this.ossClient.getBucketReferer(bucket)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteBucketReferer(bucket) {
    try {
      let result = await this.ossClient.deleteBucketReferer(bucket)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async putBucketACL(bucket, acl) {
    // 此处以创建Bucket后修改其访问权限为private为例。
    try {
      await this.ossClient.putBucketACL(bucket, acl)
    } catch (e) {
      console.log(e)
    }
  }

  // 获取存储空间的访问权限
  async getBucketAcl(bucket) {
    try {
      const result = await this.ossClient.getBucketACL(bucket)
      return result.acl
    } catch (e) {
      console.log(e)
    }
  }

  async putBucketLifecycle(bucket, options) {
    try {
     return await this.ossClient.putBucketLifecycle(bucket, options)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteBucketLifecycle(bucket) {
    try {
      return await this.ossClient.deleteBucketLifecycle(bucket)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async putBucketLogging(bucket, prefix) {
    try {
      let result = await this.ossClient.putBucketLogging(bucket, prefix)
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  async getBucketLogging(bucket) {
    try {
      let result = await this.ossClient.getBucketLogging(bucket)
      console.log(JSON.stringify(result.res.data.toString()))
    } catch (e) {
      console.log(e);
    }
  }

  async deleteBucketLogging(bucket) {
    try {
      let result = await this.ossClient.deleteBucketLogging(bucket)
      // console.log(result);
    } catch (e) {
      console.log(e)
    }
  }

}

module.exports = OssClient
