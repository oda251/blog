import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TweetEditor from './TweetEditor';
import TweetList from './TweetList';
import axios from 'axios';
import type { TagMap, TweetWithTags } from '../../entities/types/Tweet';
import TweetContext from './TweetContext';
import TagSelector from './TagSelector';

interface TweetAppProps {
	tweets: TweetWithTags[];
  readonly tagMap: TagMap;
}

export interface TweetAppState {
  tweets: TweetWithTags[];
  hasMoreOldTweets: boolean;
  tagFilter: string | null;
  debugInfo: string;
}

export class TweetApp extends React.Component<TweetAppProps, TweetAppState> {
  constructor(props: TweetAppProps) {
    super(props);
    this.state = {
      tweets: props.tweets,
      tagFilter: null,
      debugInfo: '',
    };
  }
  hasMore = true;

  loadMoreTweets = async () => {
    if (!this.hasMore) return;
    async () => {
      const url = `/api/tweets`
        + `?oldId=${this.state.tweets[this.state.tweets.length - 1].id}`
        + (this.state.tagFilter ? `&tagId=${this.state.tagFilter}` : '')
      ;
      const response = await axios.get(url);
      if (response.status === 200) {
        const newTweets = await response.data;
        if (newTweets.length > 0) {
          this.setState({
            tweets: [...this.state.tweets, ...newTweets],
          });
        } else {
          this.hasMore = false;
        }
      } else {
        this.hasMore = false;
      }
    };
  }

  loadNewTweets = async () => {
    const url = `/api/tweets`
      + `?newId=${this.state.tweets[0].id}`
      + (this.state.tagFilter ? `&tagId=${this.state.tagFilter}` : '')
    ;
    const response = await axios.get(url);
    if (response.status === 200) {
      const newTweets = await response.data;
      this.setState({
        tweets: [...newTweets, ...this.state.tweets],
      });
    } else { 
    }
  }

  reloadTweets = async () => {
    const url = `/api/tweets`
      + (this.state.tagFilter ? `?tagId=${this.state.tagFilter}` : '')
    ;
    const response = await axios.get(url);
    if (response.status === 200) {
      const newTweets = await response.data;
      this.setState({
        tweets: newTweets,
      });
      this.hasMore = true;
    } else {
      this.hasMore = false;
    }
  }

  postTweet = async (tweet: TweetWithTags) => {
    const response = await axios.post("/api/tweets", tweet, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const tagId = this.state.tagFilter;
      if (tagId && !tweet.tag_id_list.includes(tagId)) {
        this.setState({ tagFilter: null }, () => {
          this.reloadTweets();
        });
      } else {
        this.loadNewTweets();
      }
      return true;
    } else {
      return false;
    }
  }

  deleteTweet = async (tweetId: string, password: string) => {
    const response = await axios.delete(`/api/tweets?tweetId=${tweetId}`, {
      headers: {
        "Content-Type": "application/json",
        "password": password,
      },
    });
    if (response.status === 200) {
      this.setState({
        tweets: this.state.tweets.filter((tweet) => tweet.id !== tweetId),
      });
    } else {
      const error: string = await response.data.error;
      throw new Error(error);
    }
  }

  tagSelectorOnClick = (tagId: string) => {
    this.setState({ tagFilter: this.state.tagFilter === tagId ? null : tagId }, () => {
      this.reloadTweets();
    });
  }
  tagSelectorIsSelected = (tagId: string) => {
    return this.state.tagFilter === tagId;
  }

  convertTagIdToName = (tagId: string): string => {
    const tagName = this.props.tagMap.get(tagId);
    return tagName ? tagName : 'undefined';
  }

  render() {
	return (
    <TweetContext.Provider value={{
      loadMoreTweets: this.loadMoreTweets,
      loadNewTweets: this.loadNewTweets,
      postTweet: this.postTweet,
      deleteTweet: this.deleteTweet,
      tagMap: this.props.tagMap,
      convertTagIdToName: this.convertTagIdToName,
    }}>
      <div className='max-w-xl w-full px-6 mx-auto flex flex-col items-center'>
        <div className="w-full mt-4 pl-2 flex text-slate-400 items-center pb-2 border-b border-slate-500">
          <i className="fa-solid fa-tag text-slate-300 text-md"></i>
          <TagSelector
            isSelected={this.tagSelectorIsSelected}
            onClick={this.tagSelectorOnClick}
            className='text-sm ml-1 px-2 border-slate-500 border rounded-md '
            classNameSelected='text-white bg-blue-500'
            classNameUnselected='text-gray-500'
          />
        </div>
        <TweetList state={this.state} />
        <TweetEditor />
      </div>
    </TweetContext.Provider>
	);
  }
}