import React from 'react';
import TweetEditor from './TweetEditor';
import TweetList from './TweetList';
import axios from 'axios';
import { TweetWithTags } from '../../entities/types/Tweet';
import TweetContext from './TweetContext';

interface TweetAppProps {
	tweets: TweetWithTags[];
  readonly tagMap: Map<number, string>;
}

export interface TweetAppState {
  tweets: TweetWithTags[];
  page: number;
  hasMore: boolean;
  is_loading?: boolean;
  debugInfo: string;
}

export class TweetApp extends React.Component<TweetAppProps, TweetAppState> {
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
      const response = await axios.get(`/api/tweets?lastId=${this.state.tweets[this.state.tweets.length - 1].id}`);
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

  convertTagIdToName = (tagId: number): string => {
    const tagName = this.props.tagMap.get(tagId);
    return tagName ? tagName : '';
  }

  render() {
	return (
    <TweetContext.Provider value={{
      loadMoreTweets: this.loadMoreTweets,
      reloadTweets: this.reloadTweets,
      tagMap: this.props.tagMap,
      convertTagIdToName: this.convertTagIdToName,
    }}>
      <div className='w-full flex flex-col items-center'>
        <TweetList state={this.state} />
        <TweetEditor />
      </div>
    </TweetContext.Provider>
	);
  }
}