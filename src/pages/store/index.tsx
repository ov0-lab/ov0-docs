/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactNode } from 'react';
import Translate, { translate } from '@docusaurus/Translate';

import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ShowcaseSearchBar from './_components/ShowcaseSearchBar';
import ShowcaseCards from './_components/ShowcaseCards';
import ShowcaseFilters from './_components/ShowcaseFilters';

const TITLE = translate({ message: '插件商店' });
const DESCRIPTION = translate({
  message: '在此添加你的插件后即可在App中看到你的插件卡片',
});
const SUBMIT_URL = 'https://github.com/facebook/docusaurus/discussions/7826';

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
      <p>{DESCRIPTION}</p>
      <Link className="button button--primary" to={SUBMIT_URL}>
        <Translate id="showcase.header.button">+ 添加插件</Translate>
      </Link>
    </section>
  );
}

export default function Showcase(): ReactNode {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <div
          style={{ display: 'flex', marginLeft: 'auto', marginBottom: '15px' }}
          className="container">
          <ShowcaseSearchBar />
        </div>
        <ShowcaseFilters />
        <ShowcaseCards />
      </main>
    </Layout>
  );
}
