import Tweet from "../entities/types/Tweet";
import React from "react";

interface TweetsProps {
	readonly Tweet : Tweet;
}

interface TweetsState {
  page: number;
}

export default class Twiets extends React.Component<TweetsProps, TweetsState> {
  constructor(props: TweetsProps) {
	  super(props);
    this.state = {
      page: 1,
    }
  }

  render() {
	return <div></div>;
  }
}
