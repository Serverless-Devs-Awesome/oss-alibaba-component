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
      await this.ossClient.putBucket(bucketName, options);
    } catch (err) {
      console.log(err);
    }
  }


  async uploadFile (filePath, object) {
    await this.ossClient.put(object, filePath)
  }
}

module.exports = OssClient
