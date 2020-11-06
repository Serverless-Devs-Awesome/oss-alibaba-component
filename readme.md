# 前言
通过本组件，您可以简单快速使用阿里云OSS

## Yaml配置

可测试的Yaml配置

```yaml
OSSDemoComponent:
  Component:oss
  Provider: alibaba
  Properties:
    Region: 'cn-hangzhou'
    Bucket: my_test_oss_bucket
```
完整的Yaml配置：

```yaml
OSSComponent:
  Component: oss
  Provider: alibaba
  Properties:
    Region: 'cn-hangzhou'
    Bucket: MybucketName
    #    CodeUri: 本地路径
    CodeUri:
      ObjectPrefix: 前缀
      Src: 本地路径
      Excludes:
        - path1
        - path2
      Includes:
        - path1
        - path2
    Tags:
      - Key: aa
        Vaule: bbb
    StorageClass: standard
    Cors:
      - AllowedOrigin:
          - http://www.a.com
          - http://www.b.com
        AllowedMethod:
          - POST
          - GET
        AllowedHeader:
          - Authorization
        ExposeHeader:
          - x-oss-test
          - x-oss-test1
        MaxAgeSeconds: 100
        ResponseVary: true
    Referer:
      AllowEmptyReferer: true
      List:
        - http://www.aliyun.com
    Acl: public-read-write
    Lifecycle:
      - ID: aa
        Prefix: Prefix
        Status: Status
        Expiration:
          Days: Days
        Transition:
          Days: Days
          CreatedBeforeDate: CreatedBeforeDate
          StorageClass: StorageClass
        AbortMultipartUpload:
          Days: Days
          CreatedBeforeDate: CreatedBeforeDate
        Tag:
          - Key: Key
            Value: Value
        NoncurrentVersionTransition:
          NoncurrentDays: 10
          StorageClass: IA
    Policy:
      - Actions:
          - oss:PutObject
        Effect: Deny
        Principal:
          - 1234567890
        Resource:
          - acs:oss:*:1234567890:*/*
    Logging:
      Enable: true/false
      TargetBucket: TargetBucket
      TargetPrefix: TargetPrefix
    EncryptionRule:
      SSEAlgorithm: AES256
      KMSMasterKeyID: KMSMasterKeyID
    Versioning: enable
    Website:
      Pages:
        Index: index.html
        Error: error.html
        SupportSubDir: true
        Type: 1
      RoutingRules:
        RuleNumber: 1
        Condition:
          KeyPrefixEquals: abc/
          HttpErrorCodeReturnedEquals: 404
          IncludeHeader:
            Key: host
            Equals: test.oss-cn-beijing-internal.aliyuncs.com
          KeySuffixEquals: abc/
        Redirect:
          RedirectType: Mirror
          PassQueryString: true
          Mirror:
            URL: http://www.test.com/
            PassQueryString: true
            FollowRedirect: true
            CheckMd5: true
            Headers: a
              PassAll: true
              Pass:
                - myheader-key1
                - myheader-key2
              Remove:
                - myheader-key3
                - myheader-key4
              Set:
                Key: aa
                Value: aa
          Protocol: http
          HostName: www.test.com
          ReplaceKeyPrefixWith:
          EnableReplacePrefix: def/
          ReplaceKeyWith: prefix/${key}.suffix
          HttpRedirectCode: 301
```

## 参数详情

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Region | True | Enum | 地域 |
| Bucket | True | String | 存储桶名称 |
| CodeUri | True | String/Struct | 本地路径 |
| Tags | False | List<Struct> | 标签配置 |
| StorageClass | False | Enum | 指定Bucket的存储类型 |
| Cors | False | List<Struct> | 跨域资源共享 |
| Referer | False | Struct | 设置存储空间（Bucket）的防盗链（Referer）。 |
| Acl | True | Enum | 存储空间（Bucket）的访问权限（ACL）。 |
| Lifecycle | True | List<Struct> | 存储空间（Bucket）的生命周期规则。生命周期规则开启后，OSS将按照配置规则指定的时间，自动转换与规则相匹配的文件（Object）的存储类型或将其删除。 |
| Policy | False | List<Struct> | 存储空间（Bucket）设置授权策略（Policy)。 |
| Logging | False | Struct | Logging配置 |
| EncryptionRule | False | Struct | 配置存储空间（Bucket）的加密规则。 |
| Versioning | False | Enum | 存储空间（Bucket）的版本控制状态。 |
| Website | False | Struct | 将存储空间（Bucket）设置成静态网站托管模式并设置跳转规则（RoutingRule）。 |

### Region

取值: `cn-hangzhou`, `cn-shanghai`, `cn-qingdao`, `cn-beijing`, `cn-zhangjiakou`, `cn-huhehaote`, `cn-wulanchabu`, `cn-shenzhen`, `cn-heyuan`, `cn-guangzhou`, `cn-chengdu`, `cn-hongkong`, `us-west-1`, `us-east-1`, `ap-southeast-1`, `ap-southeast-2`, `ap-southeast-3`, `ap-southeast-5`, `ap-northeast-1`, `ap-south-1`, `eu-central-1`, `eu-west-1`, `me-east-1`

### CodeUri

#### 简单配置

只需要填写本地路径的字符串即可

#### 复杂配置

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Src | True | String | 本地路径 |
| Excludes | True | List<String> | 不包含某些文件（不支持通配符） |
| Includes | True | List<String> | 额外包含某些文件（不支持通配符） |

### Tags

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Key | True | String | 标签名 |
| Value | True | String | 标签值 |

### Cors

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| AllowedOrigin | True | List<String> | 指定允许的跨域请求来源。OSS允许使用多个元素来指定多个允许的来源。OSS仅允许使用一个星号（*）通配符。如果指定为星号（*），则表示允许所有来源的跨域请求。 |
| AllowedMethod | True | List<Enum> | 指定允许的跨域请求方法。 |
| AllowedHeader | False | List<String> | 控制OPTIONS预取指令Access-Control-Request-Headers中指定的Header是否被允许。 |
| ExposeHeader | False | List<String> | 指定允许用户从应用程序中访问的响应头。例如，一个Javascript的XMLHttpRequest对象。 |
| MaxAgeSeconds | False | Number | 指定浏览器对特定资源的预取（OPTIONS）请求返回结果的缓存时间。单位为秒。 |
| ResponseVary | False | Boolean | 是否返回Vary:Origin头。 |

#### AllowedMethod

取值：`GET`，`PUT`，`DELETE`，`POST`，`HEAD`

### Referer

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| AllowEmptyReferer | True | Boolean | 指定是否允许Referer字段为空的请求访问。 |
| List | True | List<String> | 指定Referer访问白名单。 |

### Acl

取值： `public-read-write`, `public-read`, `private`

### Lifecycle

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Id | False | String | 标识规则的唯一ID。最多由255个字节组成。如没有指定，或者该值为空时，OSS会自动生成一个唯一ID。 |
| Prefix | True | String | 指定规则所适用的前缀（Prefix）。Prefix不可重复。 |
| Status | True | Enum | 如果值为Enabled，那么OSS会定期执行该规则；如果为Disabled，那么OSS会忽略该规则。 |
| Expiration | True | Struct | 指定Object生命周期规则的过期属性。 |
| Transition | False | Struct | 指定Object在有效生命周期中，OSS何时将Object转储为IA、Archive和ColdArchive存储类型 。 |
| AbortMultipartUpload | False | Struct | 指定未完成分片上传的过期属性。 |
| Tag | False | List<Struct> | 指定规则所适用的对象标签，可设置多个。 |
| NoncurrentVersionTransition | False | Struct | 指定生命周期规则在Object成为非当前版本多少天后生效。 |

#### Status

#### Expiration

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Days | False | Number | 指定生命周期规则在距离Object最后更新多少天后生效。 |

#### Transition

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Days | False | Number | 指定生命周期规则在距离Object最后更新多少天后生效。 |
| StorageClass | False | Enum | 指定Object转储的存储类型。 |

#### AbortMultipartUpload

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Days | False | Number | 指定生命周期规则在距离Object最后更新多少天后生效。 |
| CreatedBeforeDate | False | String | 指定一个日期，OSS会对最后更新时间早于该日期的数据执行生命周期规则。日期必须服从ISO8601的格式，并总是UTC的零点。 例如：2002-10-11T00:00:00.000Z，表示将最后更新时间早于2002-10-11T00:00:00.000Z 的Object删除或转换成其他存储类型，等于或晚于这个时间的Object不会被删除或转储。 |


#### Tag

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Key | True | String | 标签名 |
| Value | True | String | 标签值 |

#### NoncurrentVersionTransition

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| NoncurrentDays | False | Number | 指定生命周期规则在Object成为非当前版本多少天后生效。 |
| StorageClass | False | Enum | 指定Object转储的存储类型。 |

### Policy

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Actions | False | List<String> | 行为操作 |
| Effect | False | Enum | 效果、影响 |
| Principal | False | List<String> | Principal配置 |
| Resource | False | List<String> | 资源 |

### Logging

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Enable | False | Boolean | 是否开启Logging |
| TargetPrefix | False | String | 指定最终被保存的访问日志文件前缀。可以为空。 |

### EncryptionRule

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| SSEAlgorithm | True | Enum | 设置服务端默认加密方式。 |
| KMSMasterKeyID | False | String | 设置服务端默认加密方式。 |

### Website

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Pages | True | Struct | 页面配置 |
| RoutingRules | False | List<Struct> | 路径规则 |

#### Pages

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Index | True | String | 首页配置 |
| Error | False | String | 错误页面配置 |
| SupportSubDir | False | Boolean | 子目录配置 |
| Type | True | Enum | 表示设置了默认主页后，访问以非正斜线（/）结尾的Object，且该Object不存在时的行为。假设默认主页设置为index.html，访问的文件路径是bucket.oss-cn-hangzhou.aliyuncs.com/abc，且abc这个Object不存在，此时type三种取值类型对应的行为如下：0：检查abc/index.html是否存在（即Object + 正斜线（/）+ 主页的形式），如果存在则返回302，Location头为/abc/的URL编码（即正斜线（/） + Object + 正斜线（/）的形式），如果不存在则返回404，继续检查ErrorFile。1：直接返回404，报错NoSuchKey，继续检查ErrorFile。2：检查abc/index.html是否存在，如果存在则返回该Object的内容；如果不存在则返回404，继续检查ErrorFile。 |


#### RoutingRules

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| RuleNumber | False | Number | 匹配和执行RoutingRule的序号，OSS将按照此序号依次匹配规则。如果匹配成功，则执行此规则，后续的规则不再执行。 |
| Condition | False | Struct | 匹配的条件 |
| Redirect | False | Struct | 跳转规则。 |

##### Condition

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| KeyPrefixEquals | False | String | 只有匹配此前缀的Object才能匹配此规则。 |
| HttpErrorCodeReturnedEquals | False | String | 访问指定Object时返回此status才能匹配此规则。当跳转规则是镜像回源类型时，此字段必须为404。 |
| IncludeHeader | False | List<Struct> | 只有请求中包含了指定Header，且值为指定值时，才能匹配此规则。该容器最多可指定5个。 |
| KeySuffixEquals | False | String | 只有匹配此字段指定的后缀才能匹配此规则。默认值为空，表示不匹配指定的后缀。 |

###### IncludeHeader

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| Key | True | String | 只有请求中包含了此Header，且值为Equals的指定值时，才能匹配此规则。 |
| Equals | True | String | 只有请求中包含了Key指定的Header，且值为指定值时，才能匹配此规则。 |

##### Redirect

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| RedirectType | False | Enum | 指定跳转的类型。 |
| PassQueryString | False | Boolean | 执行跳转或者镜像回源时，是否携带请求参数。 |
| Mirror | False | Struct | Mirror配置 |
| Protocol | False | Enum | 跳转时的协议。 |
| HostName | False | String | 跳转时的域名，需符合域名规范。 |
| ReplaceKeyPrefixWith | False | String | Redirect时Object名称的前缀将替换成该值。如果前缀为空，则将这个字符串插入Object 名称的前面。 |
| EnableReplacePrefix | False | Boolean | 如果此字段设置为true，则Object的前缀将被替换为ReplaceKeyPrefixWith指定的值。如果未指定此字段或为空，则表示截断Object前缀。 |
| ReplaceKeyWith | False | String | Redirect时Object名称将替换成ReplaceKeyWith指定的值，ReplaceKeyWith支持设置变量。目前支持的变量是${key}，表示该请求中的Object名称。 |
| HttpRedirectCode | False | Enum | 跳转时返回的状态码。仅在RedirectType为External或者AliCDN时生效。 |

###### Mirror

| 参数 | 必填 |  类型 |  描述 | 
|  --- |  --- |  --- |  --- | 
| URL | False | String | 仅在RedirectType为Mirror时生效，表示镜像回源的源站地址。 |
| PassQueryString | False | Boolean | 与PassQueryString作用相同，优先级高于PassQueryString。 |
| FollowRedirect | False | Boolean | 如果镜像回源获取的结果是3xx，是否要继续跳转到指定的Location获取数据。 |
| CheckMd5 | False | Boolean | 是否检查回源body的MD5。当此项为true且源站返回的response中含有Content-Md5头时，OSS检查拉取的数据MD5是否与此Header匹配，如果不匹配，则不保存在OSS上。仅在RedirectType为Mirror时生效。 |
| Headers | False | Struct | 用于指定镜像回源时携带的Header。只有在RedirectType为Mirror时生效。 |