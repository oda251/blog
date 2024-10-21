import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  useEffect(() => {
    dispatch(setTweets(tweets));
    dispatch(setTags(tagMap));
  }, [dispatch, tweets, tagMap]
  );
  return (
    <div className='max-w-xl w-full px-6 mx-auto flex flex-col items-center'>
      <TagFilterSelector />
      <TweetList className="border-t border-slate-500" />
      <TweetEditor className="mt-1" />
    </div>
  );
};

export default TweetApp;