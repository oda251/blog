import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TweetEditor from './TweetEditor';
import TweetList from './TweetList';
import type { TagMap, TweetWithTags } from '../../types/Tweet';
import type { AppDispatch } from './store';
import TagFilterSelector from './TagFilterSelector';
import { setTweets } from './slice/tweets';
import { setTags } from './slice/tags';

export interface TweetAppProps {
  tweets: TweetWithTags[];
  readonly tagMap: TagMap;
}

const TweetApp: React.FC<TweetAppProps> = ({ tweets, tagMap }) => {
  const dispatch = useDispatch<AppDispatch>();

  // On mount, fetch tags from API and update Redux
  useEffect(() => {
    dispatch(setTweets(tweets));
    // Fetch tags from API
    fetch('/api/tags')
      .then(res => res.ok ? res.json() : {})
      .then((data) => {
        // Ensure data is a valid TagMap: { [id: string]: string }
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // TypeScript: check all keys are strings and all values are strings
          const tagMapFromApi: Record<string, string> = {};
          for (const [k, v] of Object.entries(data)) {
            if (typeof k === 'string' && typeof v === 'string') {
              tagMapFromApi[k] = v;
            }
          }
          dispatch(setTags(tagMapFromApi));
        }
      })
      .catch(() => {
        // fallback to initial tagMap if fetch fails
        dispatch(setTags(tagMap));
      });
  }, [dispatch, tweets, tagMap]);

  return (
    <div className="max-w-xl w-full px-6 mx-auto flex flex-col items-center">
      <TagFilterSelector />
      <TweetList className="border-t border-slate-500" />
      <TweetEditor className="mt-1" />
    </div>
  );
};

export default TweetApp;
