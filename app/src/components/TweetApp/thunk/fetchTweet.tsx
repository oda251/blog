import type { TweetAppState } from '../store'
import type { TweetWithTags } from '../../../entities/types/Tweet';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface FetchTweetsResult {
	tweets: TweetWithTags[] | null;
}
export interface FetchTweetsPayload {
	tweetId: string;
	tag_id_list?: string[];
}

export const loadOlderTweets = createAsyncThunk<FetchTweetsResult, FetchTweetsPayload>(
	'tweets/loadOlder',
	async ({tweetId, tag_id_list}, {rejectWithValue}) => {
		const url = `/api/tweets`
		+ `?oldId=${tweetId}`
		+ (tag_id_list ? `&tagId=${tag_id_list}` : '')
	  ;
	  return axios.get(url)
		.then(response => {
			return {
				tweets: response.data as TweetWithTags[],
			}
		})
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

export const loadNewerTweets = createAsyncThunk<FetchTweetsResult, FetchTweetsPayload>(
	'tweets/loadNewer',
	async ({tweetId, tag_id_list}, {rejectWithValue}) => {
		const url = `/api/tweets`
		+ `?newId=${tweetId}`
		+ (tag_id_list ? `&tagId=${tag_id_list}` : '')
	  ;
	  return axios.get(url)
		.then(response => {
			return {
				tweets: response.data as TweetWithTags[],
			}
		})
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

export interface ReloadTweetsPayload {
	tag_id_list?: string[];
}

export const reloadTweets = createAsyncThunk<FetchTweetsResult, ReloadTweetsPayload>(
	'tweets/reload',
	async ({tag_id_list}, {rejectWithValue}) => {
		const url = `/api/tweets`
		+ (tag_id_list ? `?tagId=${tag_id_list}` : '')
	  ;
	  return axios.get(url)
		.then(response => {
			return {
				tweets: response.data as TweetWithTags[],
			}
		})
		.catch(error => {
			if (axios.isAxiosError(error)) {
				if (error.response) {
					return rejectWithValue({
						status: error.response.status,
						error: error.response.data,
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
