import React from 'react';
import TweetEditor from './TweetEditor';
import TweetList from './TweetList';
import axios from 'axios';
import type { TagMap, TweetWithTags } from '../../entities/types/Tweet';
import TweetContext from './TweetContext';

interface TweetAppProps {
	tweets: TweetWithTags[];
  readonly tagMap: TagMap;
}

export interface TweetAppState {
  tweets: TweetWithTags[];
  hasMore: boolean;
  is_loading?: boolean;
  debugInfo: string;
}

export class TweetApp extends React.Component<TweetAppProps, TweetAppState> {
  constructor(props: TweetAppProps) {
    super(props);
    this.state = {
      tweets: props.tweets,
      hasMore: true,
      debugInfo: '',
    };
    console.log(this.state.tweets[0]);
  }

  loadMoreTweets = async () => {
    if (!this.state.hasMore || this.state.is_loading) return;
    this.setState({ is_loading: true }, async () => {
      const url = `/api/tweets?oldId=${this.state.tweets[this.state.tweets.length - 1].id}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        const newTweets = await response.data;
        if (newTweets.length > 0) {
          this.setState({
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
    const url = `/api/tweets?newId=${this.state.tweets[0].id}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      const newTweets = await response.data;
      this.setState({
      tweets: [newTweets, ...this.state.tweets],
      hasMore: true,
      });
    } else {
      this.setState({ hasMore: false });
    }
  }

  convertTagIdToName = (tagId: string): string => {
    const tagName = this.props.tagMap.get(tagId);
    return tagName ? tagName : 'undefined';
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