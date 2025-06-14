import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TweetReducer } from '../slice/tweets';
import type { TweetSliceState } from '../slice/tweets';
import { TagsReducer } from '../slice/tags';
import type { TagsSliceState } from '../slice/tags';

export interface RootState {
  tweet: TweetSliceState;
  tag: TagsSliceState;
}

const rootReducer = combineReducers({
  tweet: TweetReducer,
  tag: TagsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;
