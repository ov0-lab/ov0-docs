/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react';
import DocCategoryGeneratedIndexPage from '@theme-original/DocCategoryGeneratedIndexPage';
import type { Props } from '@theme/DocCategoryGeneratedIndexPage';
import { useLayoutDoc } from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

function HintFooter() {
  const docPath = useLayoutDoc('/category/快速开始', undefined)?.path;
  return (
    <p className={styles.footerTip}>
      <Translate
        values={{
          guideLink: (
            <Link to={`${docPath}#category-link`}>
              <Translate>the generated index page guide</Translate>
            </Link>
          ),
        }}>
        {'Want to implement the same page? Read {guideLink} to find out!'}
      </Translate>
    </p>
  );
}

export default function DocCategoryGeneratedIndexPageWrapper(
  props: Props,
): ReactNode {
  return (
    <>
      <DocCategoryGeneratedIndexPage {...props} />
      <HintFooter />
    </>
  );
}
