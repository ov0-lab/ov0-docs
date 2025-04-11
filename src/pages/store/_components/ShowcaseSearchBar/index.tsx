/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { useSearchName } from '../../_utils';
import styles from './styles.module.css';

// export function ShowcaseSearchBar(): ReactNode {
//   const [searchName, setSearchName] = useSearchName();
//   return (
//     <div className={styles.searchBar}>
//       <input
//         placeholder={translate({
//           message: 'Search for site name...',
//           id: 'showcase.searchBar.placeholder',
//         })}
//         value={searchName}
//         onInput={(e) => {
//           setSearchName(e.currentTarget.value);
//         }}
//       />
//     </div>
//   );
// }


import { useEffect, useRef, useState } from 'react';
import SearchIcon from '@site/src/components/svgIcons/SearchIcon';

export default function ShowcaseSearchBar(): ReactNode {
  const [isInputFocused, setInputFocused] = useState(false);
  const [searchName, setSearchName] = useSearchName();
  const inputRef = useRef<HTMLInputElement>(null);

  const keyDownListener = (event: KeyboardEvent) => {
    if ((event.key === 'm' || (event.key === 'M')) && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      inputRef.current && inputRef.current.focus();
      event.stopPropagation()
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keyDownListener, false);
    return () => document.removeEventListener('keydown', keyDownListener);
  }, []);

  return (
    <>
      <div className={styles.wrapper}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <div className={styles.container}>
          <div className={styles.displayHorizontal}>
            <SearchIcon viewBox='0 0 1024 1024' width={200} height={200} size={'medium'} color='success' />
            <input
              ref={inputRef}
              onKeyDown={event => {

                if ('key' in event) {

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    inputRef.current && (inputRef.current.value = '');
                    inputRef.current && inputRef.current.blur();
                  }
                }
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onInput={(e) => {
                setSearchName(e.currentTarget.value);
              }}
              placeholder={translate({
                message: '搜索插件...',
                id: 'showcase.searchBar.placeholder',
              })}
              className={styles.textInput}
              style={{
                borderColor: 'green',
              }}
              value={searchName}
            />
            {
              (isInputFocused ? (
                <div className={styles.focusHint}>
                  <span className={styles.focusHintKey}
                    style={{
                      backgroundColor: 'green',
                    }}>
                    Esc
                  </span>
                </div>
              ) : (
                <div className={styles.focusHint}>
                  <span className={styles.focusHintKey}
                    style={{
                      backgroundColor: 'green',
                    }}>
                    Ctrl
                  </span>
                  <span className={styles.focusHintKey}
                    style={{
                      backgroundColor: 'green',
                    }}>
                    M
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};



// export default Search;
