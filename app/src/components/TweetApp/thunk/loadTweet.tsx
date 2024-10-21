import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewerTweets, fetchOlderTweets, fetchTweets } from '../repository/fetchTweet';
import { pbTweets, pfTweets, setTweets } from '../slice/tweets';
import type { RootState } from '../store';


export const loadOlderTweetsAction = createAsyncThunk<boolean, string>(
	'tweets/loadOlder',
	async (tweetId, {rejectWithValue, dispatch, getState}) => {
		const tagFilter = (getState() as RootState).tweet.tagFilter;
		const result = await fetchOlderTweets(tweetId, tagFilter);
		if (result.status === 200) {
			if (result.data.length === 0) {
				return false;
			} else {
				dispatch(pbTweets(result.data));
				return true;
			}
		} else {
			return rejectWithValue(result.error);
		}
	}
);

export const loadNewerTweetsAction = createAsyncThunk<void, string>(
	'tweets/loadNewer',
	async (tweetId, {rejectWithValue, dispatch, getState}) => {
		const tagFilter = (getState() as RootState).tweet.tagFilter;
		const result = await fetchNewerTweets(tweetId, tagFilter);
		if (result.status === 200) {
			dispatch(pfTweets(result.data));
			return;
		} else {
			return rejectWithValue(result.error);
		}
	}
);

export const reloadTweetsAction = createAsyncThunk<void, void>(
	'tweets/reload',
	async (_, {rejectWithValue, dispatch, getState}) => {
		const tagFilter = (getState() as RootState).tweet.tagFilter;
		const result = await fetchTweets(tagFilter);
		if (result.status === 200) {
			dispatch(setTweets(result.data));
			return;
		} else {
			return rejectWithValue(result.error);
		}
	}
);
