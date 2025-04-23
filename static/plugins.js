//@ts-check
/** 
 * 商店插件列表
 * @type {import('./tags').PluginInfo[]} 
*/
exports.plugins = [
  //#region terminal
  {
    // 用于展示在商店的插件名称
    title: 'ov0-plugin-terminal',
    // 插件描述
    description: '终端模拟插件',
    // 插件logo，请放到plugins目录对应插件文件夹下，不配置则使用默认logo
    logo: '/plugins/ov0-plugin-terminal/logo.png',
    // 源码地址，可填gitee或github，app将根据网络条件按照地址填写顺序下载
    source: [
      {
        // 代码托管平台
        platform: 'github',
        // 仓库名
        name: 'ov0-plugin-terminal',
        // 仓库主人
        owner: 'ov0-lab',
        // 仓库分支，请填写准确分支
        branch: 'main'
      },
      {
        platform: 'gitee',
        name: 'ov0-plugin-terminal',
        owner: 'ov0-lab',
        branch: 'main'
      }
    ],
    // 分类标签，可填'listener' | 'adapter' | 'nativeview' | 'webview' | 'onebot11' | 'other' ，详情见'tags.ts'
    tags: ['listener', 'webview'],
    // 可填多个，不填则使用source中的第一个仓库主人
    authors: [{
      // 作者名称
      name: 'Smallv',
      // 主页链接
      url: 'https://github.com/V2233'
    }]
  },
  //#endregion
  //#region adapter-onebot11
  {
    title: 'ov0-plugin-adapter-onebot11',
    description: '基于onebot11协议标准的适配器',
    source: [
      {
        platform: 'github',
        name: 'ov0-plugin-adapter-onebot11',
        owner: 'ov0-lab',
        branch: 'main'
      },
      {
        platform: 'gitee',
        name: 'ov0-plugin-adapter-onebot11',
        owner: 'ov0-lab',
        branch: 'main'
      },
    ],
    tags: ['favorite', 'adapter', 'onebot11'],
  },
  //#endregion
];
