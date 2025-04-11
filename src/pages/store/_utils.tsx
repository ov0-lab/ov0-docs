/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useCallback, useMemo } from 'react';
import { translate } from '@docusaurus/Translate';
import {
  usePluralForm,
  useQueryString,
  useQueryStringList,
} from '@docusaurus/theme-common';
import type { TagType, PluginInfo } from '@site/static/tags';
import { sortedPlugins } from '@site/static/tags';

export function useSearchName() {
  return useQueryString('name');
}

export function useTags() {
  return useQueryStringList('tags');
}

type Operator = 'OR' | 'AND';

export function useOperator() {
  const [searchOperator, setSearchOperator] = useQueryString('operator');
  const operator: Operator = searchOperator === 'AND' ? 'AND' : 'OR';
  const toggleOperator = useCallback(() => {
    const newOperator = operator === 'OR' ? 'AND' : null;
    setSearchOperator(newOperator);
  }, [operator, setSearchOperator]);
  return [operator, toggleOperator] as const;
}

function filterUsers({
  users,
  tags,
  operator,
  searchName,
}: {
  users: PluginInfo[];
  tags: TagType[];
  operator: Operator;
  searchName: string | null;
}) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    users = users.filter((user) =>
      user.title.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (tags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return tags.every((tag) => user.tags.includes(tag));
    }
    return tags.some((tag) => user.tags.includes(tag));
  });
}

export function useFilteredUsers() {
  const [tags] = useTags();
  const [searchName] = useSearchName();
  const [operator] = useOperator();
  return useMemo(
    () =>
      filterUsers({
        users: sortedPlugins,
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [tags, operator, searchName],
  );
}

export function useSiteCountPlural() {
  const { selectMessage } = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: 'showcase.filters.resultCount',
          description:
            '过滤结果',
          message: '{sitesCount} 个插件',
        },
        { sitesCount },
      ),
    );
}

/**
 * 解析git的url
 * @param url 
 * @returns 
 */
export function parseGitRepoUrl(url: string) {
  // 统一处理 .git 后缀和可能的 / 结尾
  const cleanedUrl = url.replace(/\.git$/, '').replace(/\/$/, '');

  // 匹配 GitHub/Gitee 的 URL 模式
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(github|gitee)\.com\/([^\/]+)\/([^\/]+)/i;
  const match = cleanedUrl.match(pattern);

  if (!match) return {
    platform: 'unknow', // 'github' 或 'gitee'
    author: 'unknow',                // 作者/组织名
    repo: 'unknow'
  }

  return {
    platform: match[1]?.toLowerCase() || 'unknow', // 'github' 或 'gitee'
    author: match[2] || 'unknow',                // 作者/组织名
    repo: match[3] || 'unknow'               // 仓库名
  };
}
