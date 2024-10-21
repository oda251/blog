import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TweetWithTags } from '../../../types/Tweet';
import type { TweetSliceState } from '../slice/tweets';
import { postTweet } from '../repository/postTweet';
import { applyTagFilterAction } from './setTagFilter';
import { reloadTweetsAction } from './loadTweet';

export const postTweetAction = createAsyncThunk<void, TweetWithTags>(
	'tweets/post',
	async (tweet, { rejectWithValue, getState, dispatch }) => {
		const result = await postTweet(tweet);
		if (result.status !== 200) {
			return rejectWithValue(result);
		}
		const state = getState() as TweetSliceState;
		let tagFilter = state.tagFilter;
		if (tagFilter !== null && !tweet.tag_id_list.includes(tagFilter)) {
			await dispatch(applyTagFilterAction(null));
		} else {
			await dispatch(reloadTweetsAction());
		}
	}
);
