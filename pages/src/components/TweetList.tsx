import type Tweet from "../entities/types/Tweet";
import TweetView from "./information/TweetView";
import tweetRepository from "../../../workers/src/repository/tweetRepository";
import React from "react";
import { FixedSizeList as List } from "react-window";

interface TweetListProps {
}

interface TweetListState {
  page: number;
  tweets: Tweet[];
  hasMore: boolean;
}

export default class TweetList extends React.Component<TweetListProps, TweetListState> {
  constructor(props: TweetListProps) {
	  super(props);
    this.state = {
      page: 1,
      tweets: [],
      hasMore: true,
    };
  }

  loadMoreTweets = async () => {
    const endpoint = process.env.BACKEND_ENDPOINT!;
    const response = await fetch(`${endpoint}/tweets?page=${this.state.page}`);
    if (response.ok) {
      const newTweets = await response.json();
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
  }

  render() {
    const { tweets, hasMore } = this.state;
    const Row = ({ index, style }) => (
      <div style={style}>
        <TweetView tweet={tweets[index]} />
      </div>
    );

    return (
      <List
        height={400}
        itemCount={tweets.length}
        itemSize={100}
        width={300}
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex === tweets.length - 1 && hasMore) {
            this.loadMoreTweets();
          }
        }}
      >
        {Row}
      </List>
    );
  }
}
