import React from 'react';
import TweetApp from './TweetApp';
import type { TweetAppProps } from './TweetApp';
import { Provider } from 'react-redux';
import store from './store';

const TweetMain: React.FC<TweetAppProps> = (props) => {
  return (
    <Provider store={store}>
      <TweetApp {...props} />
    </Provider>
  );
};

export default TweetMain;
