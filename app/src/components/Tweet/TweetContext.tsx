import React from 'react';
import type { TagMap } from '../../entities/types/Tweet';

interface TweetContextType {
  loadMoreTweets?: () => void;
  reloadTweets?: () => void;
  clickTag?: (tagId: string) => void;
  tagMap?: TagMap;
  convertTagIdToName?: (tagId: string) => string;
}

const TweetContext = React.createContext<TweetContextType>({
});

export default TweetContext;