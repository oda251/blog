import type { TagMap, TweetWithTags } from '../../../entities/types/Tweet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchTweetsResult, loadNewerTweets, loadOlderTweets, reloadTweets } from '../thunk/fetchTweet';
import { postTweet, PostTweetResult } from '../thunk/postTweet';

interface TweetSliceState {
	tweets: TweetWithTags[];
	hasMoreOldTweets: boolean;
	tags: TagMap;
	tagFilter: string | null;
	errorMessage: string | null;
	debugInfo: string;
}

const initialState: TweetSliceState = {
	tweets: [],
	hasMoreOldTweets: true,
	tags: new Map<string, string>(),
	tagFilter: null,
	errorMessage: null,
	debugInfo: '',
}

const tweetsSlice = createSlice({
	name: 'tweets',
	initialState: initialState,
	reducers: {
		setTweets: (state: TweetSliceState, action: PayloadAction<TweetWithTags[]>) => {
			state.tweets = action.payload;
			state.hasMoreOldTweets = true;
		}
	},
	extraReducers: builder => {
		builder.addCase(loadOlderTweets.fulfilled.type, (state: TweetSliceState, action: PayloadAction<FetchTweetsResult>) => {
			if (!action.payload.tweets || action.payload.tweets.length === 0) {
				state.hasMoreOldTweets = false;
			} else {
				state.tweets = [...state.tweets, ...action.payload.tweets];
			}
		});
		builder.addCase(loadOlderTweets.rejected.type, (state: TweetSliceState, action: PayloadAction<any>) => {
			state.hasMoreOldTweets = false;
		});
		builder.addCase(loadNewerTweets.fulfilled.type, (state: TweetSliceState, action: PayloadAction<FetchTweetsResult>) => {
			if (action.payload.tweets && action.payload.tweets.length > 0) {
				state.tweets = [...action.payload.tweets, ...state.tweets];
			}
		});
		builder.addCase(loadNewerTweets.rejected.type, (state: TweetSliceState, action: PayloadAction<any>) => {
		});
		builder.addCase(reloadTweets.fulfilled.type, (state: TweetSliceState, action: PayloadAction<FetchTweetsResult>) => {
			if (action.payload.tweets) {
				state.tweets = action.payload.tweets;
			}
		});
		builder.addCase(reloadTweets.rejected.type, (state: TweetSliceState, action: PayloadAction<any>) => {
		});
		builder.addCase(postTweet.fulfilled.type, (state: TweetSliceState, action: PayloadAction<PostTweetResult>) => {
			
		});
	}
})