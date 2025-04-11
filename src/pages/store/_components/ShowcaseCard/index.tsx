/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
// import Translate from '@docusaurus/Translate';
// import Image from '@docusaurus/plugin-ideal-image';
import { Tags, TagList, type TagType, type PluginInfo } from '@site/static/tags';
import { sortBy } from '@site/src/utils/jsUtils';
import Heading from '@theme/Heading';
import FavoriteIcon from '../FavoriteIcon';
import styles from './styles.module.css';

function TagItem({
  label,
  description,
  color,
}: {
  label: string;
  description: string;
  color: string;
}) {
  return (
    <li className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{ backgroundColor: color }} />
    </li>
  );
}

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map((tag) => ({ tag, ...Tags[tag] }));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        return <TagItem key={index} {...tagObject} />;
      })}
    </>
  );
}

function getCardImage(user: PluginInfo): string {
  return (
    user.logo ??
    // TODO make it configurable
    `/img/plugin-default-logo.png`
  );
}

function ShowcaseCard({ user }: { user: PluginInfo }) {
  const logo = getCardImage(user);
  return (
    <li key={user.title} className="card shadow--md">
      {/* <div className={clsx('card__image', styles.showcaseCardImage)}>
        <Image img={image} alt={user.title} />
      </div> */}
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link className={styles.showcaseCardLink}>
              {user.title}
            </Link>
            {user.tags.includes('favorite') && (
              <FavoriteIcon size="medium" style={{ marginRight: '0.25rem' }} />
            )}
          </Heading>
          <img className={styles.showcaseCardLogo} src={logo} />
        </div>
        <p className={styles.showcaseCardBody}>{user.description}</p>
      </div>
      <div className={clsx('card__footer')}>
        <ul className={styles.cardFooter} style={{ paddingLeft: 0 }}>
          <ShowcaseCardTag tags={user.tags} />
          {user.source.map((s, i) => {
            let url = ''
            let icon = ''
            if (s.platform == 'github') {
              url = `https://github.com/${s.owner}/${s.name}`
              icon = 'card-github-link'
            }
            if (s.platform == 'gitee') {
              url = `https://gitee.com/${s.owner}/${s.name}`
              icon = 'card-gitee-link'
            }
            if (s.platform == 'other') {
              url = s.url
            }
            return (
              <li key={i} className={styles.cardFooterLi} title={url} style={i === 0 ? { marginLeft: 'auto' } : { marginLeft: '8px' }}>
                <Link href={url} target="_blank" rel="noopener noreferrer" className={`${icon}`} aria-label="Git repository"></Link>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  );
}

export default React.memo(ShowcaseCard);
