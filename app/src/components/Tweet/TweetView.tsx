import React, { forwardRef, useContext } from 'react';
import type { TweetWithTags } from '../../entities/types/Tweet';
import TweetContext from './TweetContext';

interface TweetProps {
  readonly tweet: TweetWithTags;
  readonly className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const TweetView = forwardRef<HTMLDivElement, TweetProps>((props, ref) => {
  const convertTagIdToName = useContext(TweetContext).convertTagIdToName;
  const tag_id_list = props.tweet.tag_id_list;
  return (
    <div ref={ref} className={`p-4 shadow-md rounded-lg ${props.className}`}>
      <p className="tweet-content text-md text-gray-200 mb-2 break-words whitespace-pre-wrap">{props.tweet.content}</p>
      <p className="tweet-author text-sm text-gray-400 mb-1 break-words">By {props.tweet.author === "" ? "名無しさん" : props.tweet.author}</p>
      <p className="tweet-created-at text-xs text-gray-400">{props.tweet.created_at}</p>
      {tag_id_list.length > 0 &&
        <div className="tweet-tags mt-2">
          {tag_id_list.map((tagId) => (
            <span key={tagId} className="tag text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded-md mr-1">
              {convertTagIdToName && convertTagIdToName(tagId)}
            </span>
          ))}
        </div>
      }
    </div>
  );
});

export default TweetView;
