import React from 'react';

interface TweetContextType {
  loadMoreTweets?: () => void;
  reloadTweets?: () => void;
  clickTag?: (tagId: number) => void;
  tagMap?: Map<number, string>;
  convertTagIdToName?: (tagId: number) => string;
}

const TweetContext = React.createContext<TweetContextType>({
});

export default TweetContext;