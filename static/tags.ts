import { extend } from '@react-three/fiber';
import { translate } from '@docusaurus/Translate';
import { sortBy } from '@site/src/utils/jsUtils';
import { plugins } from '@site/static/plugins'

export type TagType =
  // DO NOT USE THIS TAG: we choose sites to add to favorites
  | 'favorite'
  | 'listener'
  | 'adapter'
  | 'nativeview'
  | 'webview'
  | 'onebot11'
  | 'other'
  ;

interface PluginSourceGit {
  /** 代码托管平台 */
  platform: 'github' | 'gitee',
  /** 仓库名 */
  name: string,
  /** 仓库主人 */
  owner: string,
  /** 仓库分支 */
  branch: string,
}

interface PluginSourceOther {
  /** 代码托管平台 */
  platform: 'other',
  /** 仅平台名为other时可用，此时必须填写压缩包直链 */
  url: string
}

export type PluginInfo = {
  /** 用于展示在商店的插件名称 */
  title: string;
  /** 插件描述 */
  description: string;
  /** 插件logo，请放到plugins目录对应插件文件夹下，不配置则使用默认logo */
  logo?: string;
  /** 来源 */
  source: Array<PluginSourceGit | PluginSourceOther>;
  /** 标签，可填'listener' | 'adapter' | 'nativeview' | 'webview' | 'onebot11' | 'other' ，详情见'tags.ts' */
  tags: TagType[];
  /** 作者，不填则使用source的第一个地址链接内的作者 */
  author?: string
};

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export const Tags: { [type in TagType]: Tag } = {
  favorite: {
    label: translate({ message: '热门' }),
    description: translate({
      message:
        'Our favorite Docusaurus sites that you must absolutely check out!',
      id: 'showcase.tag.favorite.description',
    }),
    color: '#e9669e',
  },

  listener: {
    label: translate({ message: '监听器' }),
    description: translate({
      message: '普通应用类插件!',
      id: 'showcase.tag.listener.description',
    }),
    color: '#39ca30',
  },

  adapter: {
    label: translate({ message: '适配器' }),
    description: translate({
      message: '向监听器发布事件的插件!',
      id: 'showcase.tag.adapter.description',
    }),
    color: '#dfd545',
  },

  nativeview: {
    label: translate({ message: '原生视图' }),
    description: translate({
      message:
        '包含app原生视图的插件!',
      id: 'showcase.tag.nativeview.description',
    }),
    color: '#a44fb7',
  },

  webview: {
    label: translate({ message: '网页视图' }),
    description: translate({
      message:
        '包含网页视图的插件',
      id: 'showcase.tag.webview.description',
    }),
    color: '#127f82',
  },

  onebot11: {
    label: translate({ message: 'onebot11' }),
    description: translate({
      message:
        '基于onebot11协议标准的适配器',
      id: 'showcase.tag.onebot11.description',
    }),
    color: '#128f82',
  },

  other: {
    label: translate({ message: '其它' }),
    description: translate({
      message:
        '高级插件',
      id: 'showcase.tag.other.description',
    }),
    color: '#ff8f82',
  },
};

export const TagList = Object.keys(Tags) as TagType[];
function sortPlugins() {
  let result = plugins;
  // Sort by site name
  result = sortBy(result, (plugin) => plugin.title);
  // Sort by favorite tag, favorites first
  result = sortBy(result, (plugin) => !plugin.tags.includes('favorite'));
  return result;
}

export const sortedPlugins = sortPlugins();
