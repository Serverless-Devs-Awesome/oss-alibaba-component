'use strict'

const { Component } = require('@serverless-devs/s-core')
const { green, yellow, blue, red} = require('colors')
const { deployImpl } = require('./command-impl/deploy')
const { removeImpl } = require('./command-impl/remove')

class OSSComponent extends Component {
  // TODO make sure all operation succeed
  // 部署操作
  async deploy(inputs) {
    console.log(blue('OSS config deploying...'))
    await deployImpl(this.handlerInputs(inputs))
    console.log(blue('OSS CDN config succeed'))
  }

  // 移除操作
  async remove(inputs) {
    console.log(blue('OSS config removing...'))
    await removeImpl(this.handlerInputs(inputs))
    console.log(blue('OSS CDN config succeed'))
  }

  // 解析入参
  handlerInputs (inputs) {
    const properties = inputs.Properties || {}
    const credentials = inputs.Credentials || {}
    const state = inputs.State || {}
    const args = this.args(inputs.Args)

    const region = properties.Region || {}
    const bucket = properties.Bucket|| {}
    const codeUri = properties.codeUri || {}
    const tags = properties.Tags || {}

    const storageClass = properties.StorageClass || {}
    const cors = properties.Cors || {}
    const referer = properties.Referer || {}
    const acl = properties.Acl || {}
    const dataRedundancyType = properties.DataRedundancyType|| {}
    const lifecycle = properties.Lifecycle || {}

    const policy = properties.Policy || {}
    const logging = properties.Logging || {}
    const encryptionRule = properties.EncryptionRule || {}
    const versioning = properties.Versioning || {}

    const domains = properties.Domains || {}
    const website = properties.Website || {}

    return {
      credentials, state, args, properties,
      region, bucket, codeUri, tags, storageClass,
      cors, referer, acl, lifecycle, policy, logging,
      encryptionRule, versioning, domains, website, dataRedundancyType
    }
  }
}

module.exports = OSSComponent