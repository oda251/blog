import type { TweetWithTags } from '../../../types/Tweet';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  loadOlderTweetsAction,
  loadNewerTweetsAction,
  reloadTweetsAction,
} from '../thunk/loadTweet';
import { postTweetAction } from '../thunk/postTweet';
import { deleteTweetAction } from '../thunk/deleteTweet';
import { applyTagFilterAction } from '../thunk/setTagFilter';

export interface TweetSliceState {
  isLoading: boolean;
  tweets: TweetWithTags[];
  hasMoreOldTweets: boolean;
  tagFilter: string | null;
  errorMessage: string | null;
  debugInfo: string;
}

const initialState: TweetSliceState = {
  isLoading: false,
  tweets: [],
  hasMoreOldTweets: true,
  tagFilter: null,
  errorMessage: null,
  debugInfo: '',
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState: initialState,
  reducers: {
    removeTweet: (state: TweetSliceState, action: PayloadAction<string>) => {
      state.tweets = state.tweets.filter(
        (tweet) => tweet.id !== action.payload
      );
    },
    setTweets: (
      state: TweetSliceState,
      action: PayloadAction<TweetWithTags[]>
    ) => {
      state.tweets = action.payload;
      state.hasMoreOldTweets = true;
    },
    pbTweets: (
      state: TweetSliceState,
      action: PayloadAction<TweetWithTags[]>
    ) => {
      state.tweets = [...state.tweets, ...action.payload];
      state.hasMoreOldTweets = true;
    },
    pfTweets: (
      state: TweetSliceState,
      action: PayloadAction<TweetWithTags[]>
    ) => {
      state.tweets = [...action.payload, ...state.tweets];
      state.hasMoreOldTweets = true;
    },
    setTagFilter: (
      state: TweetSliceState,
      action: PayloadAction<string | null>
    ) => {
      state.tagFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOlderTweetsAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadOlderTweetsAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(loadOlderTweetsAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
    builder.addCase(loadNewerTweetsAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadNewerTweetsAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(loadNewerTweetsAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
    builder.addCase(reloadTweetsAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(reloadTweetsAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(reloadTweetsAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
    builder.addCase(postTweetAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(postTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(postTweetAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
    builder.addCase(deleteTweetAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteTweetAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
    builder.addCase(applyTagFilterAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(applyTagFilterAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(applyTagFilterAction.rejected, (state, action) => {
      const value = action.payload;
      if (value) {
        console.log(value);
      }
      state.isLoading = false;
    });
  },
});

export const { removeTweet, setTweets, pbTweets, pfTweets, setTagFilter } =
  tweetsSlice.actions;
export const TweetReducer = tweetsSlice.reducer;
