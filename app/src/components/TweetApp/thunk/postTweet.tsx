import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import type { TweetWithTags } from '../../../entities/types/Tweet';
import axios from 'axios';

export interface PostTweetPayload {
	  tweet: TweetWithTags;
}
export interface PostTweetResult {
}

export const postTweet = createAsyncThunk<PostTweetResult, PostTweetPayload>(
	'tweets/post',
	async ({ tweet }, { rejectWithValue }) => {
		return axios.post('/api/tweets', tweet)
			.then()
			.catch(error => {
				if (axios.isAxiosError(error)) {
					if (error.response) {
						return rejectWithValue({
							status: error.response?.status,
							error: error.response?.data,
						});
					} else {
						return rejectWithValue({
							status: -1,
							error: error.message,
						});
					}
				} else {
					return rejectWithValue({
						status: -1,
						error: error.message,
					});
				}
			});
	}
);
