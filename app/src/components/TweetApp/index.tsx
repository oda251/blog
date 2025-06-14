import React from 'react';
import TweetApp from './TweetApp';
import type { TweetAppProps } from './TweetApp';
import { Provider } from 'react-redux';
import store from './store';

// Move store creation outside the component to avoid remounting/resetting Redux state
// (If store is already created at module level, ensure it is not recreated per render)

const TweetMain: React.FC<TweetAppProps> = (props) => (
  <Provider store={store}>
    <TweetApp {...props} />
  </Provider>
);

export default TweetMain;
