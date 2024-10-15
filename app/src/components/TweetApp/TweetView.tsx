import React, { forwardRef, useContext } from 'react';
import Linkify from 'linkify-react';
import type { TweetWithTags } from '../../entities/types/Tweet';
import TweetContext from './TweetContext';
import DeleteTweetButton from './DeleteTweetBottun';


interface TweetProps {
  readonly tweet: TweetWithTags;
  readonly className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const TweetView = forwardRef<HTMLDivElement, TweetProps>((props, ref) => {
  const convertTagIdToName = useContext(TweetContext).convertTagIdToName;
  const deleteTweet = useContext(TweetContext).deleteTweet;
  const tag_id_list = props.tweet.tag_id_list;
  const linkifyOptions = {
    className: 'text-blue-400 underline',
    target: {
      url: '_blank', // 新しいタブで開く
    },
  };
  return (
    <div ref={ref} className={`p-4 shadow-md rounded-lg ${props.className}`}>
      <Linkify
        as='p'
        className='tweet-content text-md text-gray-200 mb-2 break-words whitespace-pre-wrap'
        options={linkifyOptions}
      >
        { props.tweet.content }
      </Linkify>
      <p className="tweet-author text-sm text-gray-400 mb-1 break-words">By {props.tweet.author === "" ? "名無しさん" : props.tweet.author}</p>
      <div className="tweet-actions flex justify-end">
        <DeleteTweetButton tweetId={props.tweet.id!} className="mr-2" deleteTweet={deleteTweet} />
      </div>
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
