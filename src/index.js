'use strict'

const {Component, Log} = require('@serverless-devs/s-core')
const {deployImpl} = require('./command-impl/deploy')
const {removeImpl} = require('./command-impl/remove')
const log = new Log()

const helpMessage = {
    deploy: {
        description: `Usage: s deploy [command]
    Deploy a oss bucket`,
        commands: [{
            name: 'config',
            desc: 'only deploy config.'
        }, {
            name: 'object',
            desc: 'only upload objects.'
        }],
        args: [{
            name: '--tag',
            desc: '\t\tonly deploy config: tag.'
        }, {
            name: '--cors',
            desc: '\t\tonly deploy config: cors.'
        }, {
            name: '--referer',
            desc: '\tonly deploy config: referer.'
        }, {
            name: '--acl',
            desc: '\t\tonly deploy config: acl.'
        }, {
            name: '--lifecycle',
            desc: '\tonly deploy config: lifecycle.'
        }, {
            name: '--logging',
            desc: '\tonly deploy config: logging.'
        }, {
            name: '--encryption',
            desc: '\tnly deploy config: encryption.'
        }, {
            name: '--versioning',
            desc: '\tonly deploy config: versioning.'
        }, {
            name: '--website',
            desc: '\tonly deploy config: website.'
        }]
    },
    remove: {
        description: `Usage: s remove [command]
  
    Delete oss bucket.`,
        commands: [],
        args: []
    },
}

class OSSComponent extends Component {

    // 部署操作
    async deploy(inputs) {
        this.help(inputs, helpMessage.deploy)
        log.info('OSS config deploying...')
        const result = await deployImpl(this.handlerInputs(inputs))
        log.info('OSS config succeed')
        return result
    }

    // 移除操作
    async remove(inputs) {
        this.help(inputs, helpMessage.remove)
        log.info('OSS config removing...')
        await removeImpl(this.handlerInputs(inputs))
        log.info('OSS config removed')
        return {}
    }

    // 解析入参
    handlerInputs(inputs) {
        const properties = inputs.Properties || {}
        const credentials = inputs.Credentials || {}
        const state = inputs.State || {}
        const args = this.args(inputs.Args)

        const region = properties.Region || {}

        const bucket = properties.Bucket || {}

        const codeUri = properties.CodeUri || {}

        const tags = properties.Tags || {}


        const storageClass = properties.StorageClass || undefined
        const cors = properties.Cors || {}
        const referer = properties.Referer || {}
        const acl = properties.Acl || {}
        const dataRedundancyType = properties.DataRedundancyType || {}
        const lifecycle = properties.Lifecycle || {}

        const policy = properties.Policy || {}
        const logging = properties.Logging || {}
        const encryptionRule = properties.EncryptionRule || {}
        const versioning = properties.Versioning || {}

        const domains = properties.Domains || {}
        const tempWebsite = properties.Website || {}
        const website = {}
        if (tempWebsite.Pages) {
            if (tempWebsite.Pages.Index) {
                website.Index = tempWebsite.Pages.Index
            }
            if (tempWebsite.Pages.Error) {
                website.Error = tempWebsite.Pages.Error
            }
            if (tempWebsite.Pages.SupportSubDir) {
                website.SupportSubDir = tempWebsite.Pages.SupportSubDir
            }
            if (tempWebsite.Pages.Type) {
                website.Type = tempWebsite.Pages.Type
            }
        }
        if (tempWebsite.RoutingRules) {
            const tempRoutingRules = []
            for (let i = 0; i < tempWebsite.RoutingRules.length; i++) {
                const tempRole = tempWebsite.RoutingRules[i]
                const tempResult = {}
                if (tempRole.RuleNumber) {
                    tempResult.RuleNumber = tempRole.RuleNumber
                }
                if (tempRole.Condition) {
                    tempResult.Condition = tempRole.Condition
                }
                if (tempRole.Redirect) {
                    if (tempRole.Redirect.Mirror) {
                        if (tempRole.Redirect.Mirror.URL) {
                            tempRole.Redirect.MirrorURL = tempRole.Redirect.Mirror.URL
                        }
                        if (tempRole.Redirect.Mirror.PassQueryString) {
                            tempRole.Redirect.MirrorPassQueryString = tempRole.Redirect.Mirror.PassQueryString
                        }
                        if (tempRole.Redirect.Mirror.FollowRedirect) {
                            tempRole.Redirect.MirrorFollowRedirect = tempRole.Redirect.Mirror.FollowRedirect
                        }
                        if (tempRole.Redirect.Mirror.CheckMd5) {
                            tempRole.Redirect.MirrorCheckMd5 = tempRole.Redirect.Mirror.CheckMd5
                        }
                        if (tempRole.Redirect.Mirror.Headers) {
                            tempRole.Redirect.MirrorHeaders = tempRole.Redirect.Mirror.Headers
                        }
                        delete tempRole.Redirect.Mirror
                    }
                    tempResult.Redirect = tempRole.Redirect
                }
                tempRoutingRules.push(tempResult)
            }
            website.RoutingRules = tempRoutingRules
        }

        return {
            credentials, state, args, properties,
            region, bucket, codeUri, tags, storageClass,
            cors, referer, acl, lifecycle, policy, logging,
            encryptionRule, versioning, domains, website, dataRedundancyType
        }
    }
}

module.exports = OSSComponent