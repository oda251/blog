import React, { forwardRef, useContext } from 'react';
import type { TweetWithTags } from '../../types/Tweet';
import Linkify from 'linkify-react';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

interface ArticleViewProps {
  readonly tweet: TweetWithTags;
  readonly className?: string;
}

const ArticleView: React.FC<ArticleViewProps> = (props) => {
  const tagMap = useSelector((state: RootState) => state.tag.tags);
  const tag_id_list = props.tweet.tag_id_list;
  const linkifyOptions = {
    className: 'text-blue-400 underline',
    target: {
      url: '_blank', // 新しいタブで開く
    },
  };
  const is_article: boolean = props.tweet.article ? true : false;
  const title = is_article ? props.tweet.content : null;
  const article = is_article ? props.tweet.article : props.tweet.content;
  return (
	<div className={`p-4 shadow-md rounded-lg ${props.className}`}>
	  {title &&
		<Linkify
			as='h2'
			className='tweet-content text-xl text-gray-200 mb-2 break-words whitespace-pre-wrap'
			options={linkifyOptions}
			>
			{ title }
		</Linkify>
	  }
	  <p className="tweet-author text-sm text-gray-400 mb-1 break-words">By {props.tweet.author === "" ? "名無しさん" : props.tweet.author}</p>
	  <p className="tweet-created-at text-xs text-gray-400">{props.tweet.created_at}</p>
	  {tag_id_list.length > 0 &&
		<div className="tweet-tags mt-2">
		  {tag_id_list.map((tagId) => (
			<span key={tagId} className="tag text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded-md mr-1">
			  { tagMap[tagId] }
			</span>
		  ))}
		</div>
	  }
	  <Linkify
		as='p'
		className='tweet-content text-md text-gray-200 mb-2 break-words whitespace-pre-wrap'
		options={linkifyOptions}
	  >
		{ article }
	  </Linkify>
	</div>
  );
}

export default ArticleView;