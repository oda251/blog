import React, { forwardRef, useEffect, useRef } from 'react';
import type Tweet from '../../entities/types/Tweet';

interface TweetProps {
  readonly tweet: Tweet;
  readonly className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const TweetView = forwardRef<HTMLDivElement, TweetProps>((props, ref) => {
  return (
    <div ref={ref} className={`p-4 shadow-md rounded-lg ${props.className}`}>
      <p className="tweet-content text-md text-gray-200 mb-2 break-words whitespace-pre-wrap">{props.tweet.content}</p>
      <p className="tweet-author text-sm text-gray-400 mb-1 break-words">By {props.tweet.author === "" ? "名無しさん" : props.tweet.author}</p>
      <p className="tweet-created-at text-xs text-gray-400">{props.tweet.created_at}</p>
    </div>
  );
});

export default TweetView;
