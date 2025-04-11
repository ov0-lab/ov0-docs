---
sidebar_position: 1
---

# 插件

ov0的插件包含Listener、Adapter、NativeComponent三大类，Adapter用于将聊天平台的接口转换为onebot俗称约定的事件发布给Listener消费，Listener用于监听Adapter的事件并作出动作响应，而NativeComponent用于扩展App的原生视图，每个类都提供了丰富的方法和实用工具，本章我们仅介绍事件监听器的用法，在之后的API章节会单独对每个类进行介绍。另外你也可以用普通的html、css等H5技术来写自己插件的小程序。

## 目录结构

在你需要放置的目录下执行以下命令并根据提示创建开发模板

```js
npm create ov0@latest
```

生成以下目录结构示例（可能因版本变动不同，请以最新版本生成的目录为准）：
```sh
├─ src # 源码
│  └─index.js # 入口文件
├─ web # 源码
│  ├─assets # 打包的静态资源
│  | └─ logo.png
|  ├──index.html # 入口文件
├─ public # 公共资源文件
|  └─logo.png
├─ README.md
└─ package.json
```

打开src/index.js，写下以下代码：
```js
import { logger } from 'ov0'
logger.info('hello world!')
```

此时你完成了最简单的插件，编译发布后你可以在app安装终端模拟插件查看你的插件运行效果。


## Listener

### 快速了解

Listener译为监听者，可以监听来自适配器发布的消息，ov0弱化了Plugin的概念是因为监听者仅仅是插件功能的一部分。作为跨平台的移动端Bot应用框架，监听者可同时监听多个平台即多个适配器发布的消息，以及app内部的系统消息，它是你的应用和聊天平台交互的直接方法。你可以按照如下方式创建一个最简单的处理Bot消息的插件：

```js
import { Listener } from 'ov0'

const app = new Listener({
  // 插件名称
  name: '',
  // 支持的适配器，适配器是事件发布来源
  adapters: ['onebot11']
})

app.on('message',(e)=>{
  // 作出回复
  e.reply('hello world!')
})
```

该插件监听了message事件，并在收到消息后立即回复，当然它会对每一条消息作出回应，因此我们可以拓展它的功能让它过滤掉一些消息，只有消息满足条件时这个监听器才会执行：

```js
// ...上面一样

app.on('message',(e)=>{
  e.reply('hello world!')
},{
  reg: '^hello'
})
```

这样它能够响应所有以hello开头的消息，reg是regular expression的简写，如果你懂一些编程应该对此不会感到陌生，上面的reg配置等同于以下代码：

```js
// ...上面一样

app.on('message',(e)=>{
  if(e.msg.startsWith('hello')) {
    e.reply('hello world!')
  } 
})
```

当然e.msg属性只有当监听的事件以message开头时才会存在,我们更推荐你采用上面的配置式写法，因为它可以在不满足正则条件时跳过你的监听器以免发生意外，同时配置的内容可以出现在app的插件状态统计页面，让使用者更多了解你的插件。

### 发送消息链

大多数聊天平台单次都可以发送组合式消息，我们将类似文本、图片、At、音频之类的消息称为消息元素，多个消息元素按顺序排列构成了消息链，当然，发送不同格式的消息并不困难，你只需要调用ov0提供的构造消息元素的方法即可。

和云崽等框架类似，ov0提供了相同的segment方法：

```js
import { Listener,segment } from 'ov0'

const app = new Listener({
  // 插件名称
  name: '',
  // 支持的适配器
  adapters: ['onebot11']
})

app.on('message',(e)=>{
  // 作出回复
  e.reply([segment.at(e.user_id),segment.text('hello'),segment.image('https://xxx.com/1.png')])
})
```

这将回复一条同时包含@和hello文本和一张图片的消息，当然如果你的组合非常多，ov0提供了更方便的消息发送接口：

```js
import { Listener,segment,useRes } from 'ov0'

const app = new Listener({
  // 插件名称
  name: '',
  // 支持的适配器
  adapters: ['onebot11']
})

app.on('message',(e)=>{
  const res = useRes(e)
  res.at(e.user_id).text('hello').image('https://xxx.com/1.png').send()
})
```

尽管大多数场景你不会为单条消息添加很多类，但是这在你想发送多条换行消息文本时显得非常清晰简洁：

```js
// 同上
app.on('message',(e)=>{
  const res = useRes(e)
  res.text('这\n')
     .text('是\n')
     .text('一\n')
     .text('条\n')
     .text('换\n')
     .text('行\n')
     .text('消\n')
     .text('息\n')
     .image('坤坤.png')
     // 注意一定要以该方法结束才会发送出去
     .send()
})
```

useRes是对消息事件回复的封装，它的功能不止于此，除此以外，ov0提供了许多类似的工具函数，你也可以将其视作事件的钩子函数，这些钩子让你的应用功能更加丰富便捷。

### typescript支持

ov0提供了强大的类型提示支持，即使你没有了解过typescript，ov0也推荐你使用typescript模板创建插件，你可以不需要查阅文档就能在编辑器中查看所有的事件以及方法的类型和用例介绍，这极大提升了开发体验，当然为了降低开发门槛，你可以完全在自己代码中写any类型。

ov0类型系统的强大之处在于它能根据你传入的适配器类型自动合并所有的方法和事件类型，

```ts
import { Listener,segment,useRes } from 'ov0'
import { Onebot11Adapter } from 'ov0-plugin-adapter-onebot11'
import { IcqqAdapter } from 'ov0-plugin-adapter-Icqq'

// 双尖括号里可以写入你需要适配器的联合类型
const app = new Listener<Onebot11Adapter>({
  // 插件名称
  name: '',
  // 支持的适配器
  adapters: ['onebot11'，'icqq']
})

app.on('message',(e)=> {
  const res = useRes(e)
  res.at(e.user_id).text('hello').image('https://xxx.com/1.png').send()
})
```

此时e的类型将根据你传入的事件名称类型动态改变并合并两个适配器相同事件的类型，如果e中的某个属性在不是所有适配器都有的，那么它会提示其它适配器中该属性类型或undefined：

```ts
import { Listener,segment,useRes } from 'ov0'
import { Onebot11Adapter } from 'ov0-plugin-adapter-onebot11'
import { IcqqAdapter } from 'ov0-plugin-adapter-icqq'

// 双尖括号里可以写入你需要适配器的联合类型
const app = new Listener<Onebot11Adapter>({
  // 插件名称
  name: '',
  // 支持的适配器
  adapters: ['onebot11'，'icqq']
})

app.on('message',(e)=> {
  // 假设onebot11适配器未提供e.reply方法
  // 条件选择icqq适配器发送消息，回调函数传递该适配器的事件参数
  e.selectAdapter('icqq',(event)=>{
    const res = useRes(e)
    res.at(event.user_id).text('hello').image('https://xxx.com/1.png').send()
  })
})
```

### 总结

看到这里，你了解了如何使用ov0的Listener类发送消息，如果你想了解Listener的更多方法以及其它api，请查看后面的api章节。




