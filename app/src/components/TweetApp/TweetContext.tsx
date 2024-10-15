import React from 'react';
import type { TagMap, TweetWithTags } from '../../entities/types/Tweet';

interface TweetContextType {
  loadMoreTweets?: () => Promise<void>;
  loadNewTweets?: () => Promise<void>;
  postTweet?: (tweet: TweetWithTags) => Promise<boolean>;
  deleteTweet?: (tweetId: string, password: string) => Promise<void>;
  clickTag?: (tagId: string) => void;
  tagMap?: TagMap;
  convertTagIdToName?: (tagId: string) => string;
}

const TweetContext = React.createContext<TweetContextType>({
});

export default TweetContext;