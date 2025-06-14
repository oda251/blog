import React, { forwardRef } from 'react';
import Linkify from 'linkify-react';
import type { TweetWithTags } from '../../types/Tweet';
import DeleteTweetButton from './DeleteTweetBottun';
import type { RootState } from './store';
import { useSelector } from 'react-redux';

interface TweetProps {
  readonly tweet: TweetWithTags;
  readonly className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const TweetView = forwardRef<HTMLDivElement, TweetProps>((props, ref) => {
  const tagMap = useSelector((state: RootState) => state.tag.tags);
  const tag_id_list = props.tweet.tag_id_list;
  const linkifyOptions = {
    className: 'text-blue-400 underline',
    target: {
      url: '_blank', // 新しいタブで開く
    },
  };
  return (
    <div
      ref={ref}
      className={`p-4 shadow-md rounded-lg relative ${props.className}`}
    >
      <Linkify
        as="p"
        className="tweet-content text-md text-gray-200 mb-2 break-words whitespace-pre-wrap"
        options={linkifyOptions}
      >
        {props.tweet.content}
      </Linkify>
      <p className="tweet-author text-xs text-gray-400 mb-1 break-words">
        By {props.tweet.author === '' ? '名無しさん' : props.tweet.author}
      </p>
      <p className="tweet-created-at text-xs text-gray-400">
        {props.tweet.created_at}
      </p>
      {tag_id_list.length > 0 && (
        <div className="tweet-tags mt-2">
          {tag_id_list.map((tagId) => (
            <span
              key={tagId}
              className="tag text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded-md mr-1"
            >
              {tagMap[tagId]}
            </span>
          ))}
        </div>
      )}
      <DeleteTweetButton
        tweetId={props.tweet.id!}
        className="absolute bottom-0 right-0 text-slate-500 px-3 py-3"
      />
    </div>
  );
});

export default TweetView;
