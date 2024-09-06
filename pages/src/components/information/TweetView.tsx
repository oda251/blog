import type Tweet from '../../entities/types/Tweet';
import React from 'react';

interface TweetProps {
  readonly tweet: Tweet;
  readonly className?: string;
}

interface TweetState {
}

export default class TweetView extends React.Component<TweetProps, TweetState> {

  constructor(props: TweetProps) {
    super(props);
  }
  render() {
    const className: string = this.props.className || '';
    return (
      <div className={className}>
        <p className='tweet-content'>{this.props.tweet.content}</p>
        <p className='tweet-author'>{this.props.tweet.author}</p>
        <p className='tweet-created-at'>{this.props.tweet.created_at}</p>
      </div>
    );
  }
}
