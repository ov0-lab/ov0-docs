import type { ReactNode } from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomeHeader from '@site/src/components/HomeHeader';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
// import Heading from '@theme/Heading';
// import clsx from 'clsx';
// import Link from '@docusaurus/Link';

import styles from './index.module.css';

function HomepageHeader() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div id="home__header">
        <HomeHeader />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  return (
    <>
      <Layout
        title={`Welcome to ${siteConfig.title}`}
        description="聊天平台机器人移动应用框架"
        noFooter={location.pathname == '/' ? true : false}
      >
        {/* <HomepageHeader /> */}
        {/* <main>
        <HomepageFeatures />
      </main> */}
      </Layout>
      <HomepageHeader />
    </>
  );
}
