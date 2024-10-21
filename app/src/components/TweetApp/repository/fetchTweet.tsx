import type { TweetWithTags } from '../../../types/Tweet';
import axios from 'axios';
import type { Result } from '../../../types/Result';

export async function fetchOlderTweets(tweetId: string, tagFilter: string | null): Promise<Result<TweetWithTags[]>> {
	const url = `/api/tweets`
		+ `?oldId=${tweetId}`
		+ (tagFilter ? `&tagId=${tagFilter}` : '')
	;
	let result: Result<TweetWithTags[]> = { status: 200, data: [] };
	try {
		const response = await axios.get(url);
		result.data = response.data as TweetWithTags[];
		return result;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				result.status = error.response.status;
				result.error = error.response.data;
				return result;
			} else {
				result.status = -1;
				result.error = error.message;
				return result;
			}
		} else {
			result.status = -1;
			result.error = error.message;
			return result;
		}
	}
}

export async function fetchNewerTweets(tweetId: string, tagFilter: string | null): Promise<Result<TweetWithTags[]>> {
	const url = `/api/tweets`
		+ `?newId=${tweetId}`
		+ (tagFilter ? `&tagId=${tagFilter}` : '')
	;
	let result: Result<TweetWithTags[]> = { status: 200, data: [] };
	try {
		const response = await axios.get(url);
		result.data = response.data as TweetWithTags[];
		return result;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				result.status = error.response.status;
				result.error = error.response.data;
				return result;
			} else {
				result.status = -1;
				result.error = error.message;
				return result;
			}
		} else {
			result.status = -1;
			result.error = error.message;
			return result;
		}
	}
}

export async function fetchTweets(tagFilter: string | null): Promise<Result<TweetWithTags[]>> {
	const url = `/api/tweets`
		+ (tagFilter ? `?tagId=${tagFilter}` : '')
	;
	let result: Result<TweetWithTags[]> = { status: 200, data: [] };
	try {
		const response = await axios.get(url);
		result.data = response.data as TweetWithTags[];
		return result;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				result.status = error.response.status;
				result.error = error.response.data;
				return result;
			} else {
				result.status = -1;
				result.error = error.message;
				return result;
			}
		} else {
			result.status = -1;
			result.error = error.message;
			return result;
		}
	}
}
