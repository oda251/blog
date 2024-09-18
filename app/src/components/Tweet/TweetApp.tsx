import React from 'react';
import TweetEditor from './TweetEditor';
import TweetList from './TweetList';
import type Tweet from '../../entities/types/Tweet';
import axios from 'axios';
import ToggleTweetEditor from './ToggleTweetEditor';

interface TweetAppProps {
	tweets: Tweet[];
}

export interface TweetAppState {
  tweets: Tweet[];
  page: number;
  hasMore: boolean;
  is_loading?: boolean;
  debugInfo: string;
}

export class TweetApp extends React.Component<TweetAppProps, TweetAppState> {
  DataContext: React.Context<TweetAppState> = React.createContext(this.state);

  constructor(props: TweetAppProps) {
	super(props);
	this.state = {
	  tweets: props.tweets,
	  page: 1,
	  hasMore: true,
	  debugInfo: '',
	};
  }

  loadMoreTweets = async () => {
    if (!this.state.hasMore || this.state.is_loading) return;
    this.setState({ is_loading: true }, async () => {
      const response = await axios.get(`/api/tweets?page=${this.state.page + 1}`);
      if (response.status === 200) {
        const newTweets = await response.data;
        if (newTweets.length > 0) {
          this.setState({
            page: this.state.page + 1,
            tweets: [...this.state.tweets, ...newTweets],
          });
        } else {
          this.setState({ hasMore: false });
        }
      } else {
        this.setState({ hasMore: false });
      }
      this.setState({ is_loading: false });
    });
  }

  reloadTweets = async () => {
	const response = await axios.get(`/api/tweets?page=1`);
	if (response.status === 200) {
	  const newTweets = await response.data;
	  this.setState({
		tweets: newTweets,
		page: 1,
		hasMore: true,
	  });
	} else {
	  this.setState({ hasMore: false });
	}
  }

  render() {
	return (
		<div className='w-full flex flex-col items-center'>
			<TweetList state={this.state} loadMoreTweets={this.loadMoreTweets}/>
			<TweetEditor reloadTweets={this.reloadTweets}/>
      {/* <ToggleTweetEditor /> */}
		</div>
	);
  }
}