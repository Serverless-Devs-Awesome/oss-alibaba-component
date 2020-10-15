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

}

module.exports = OssClient
