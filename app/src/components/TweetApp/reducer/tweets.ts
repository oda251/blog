import type { TweetWithTags } from '../../../entities/types/Tweet';
import { PayloadAction } from '@reduxjs/toolkit';
import { loadOldTweets, loadNewTweets, reloadTweets } from '../thunk/fetchTweet';
import { deleteTweet } from '../thunk/deleteTweet';
import { postTweet } from '../thunk/postTweet';
import { TweetAppState } from '../TweetApp';
import { WithPassword } from '../../../entities/types/WithPassword';

export const pushBackTweetsReducer = async (state: TweetAppState, action: PayloadAction<void>) => {
	if (state.hasMoreOldTweets === false) {
		return state
	}
	const tweets = state.tweets;
	const tagFilter = state.tagFilter;
	const oldestTweetId: string = tweets[tweets.length - 1].id!;
	const result = await loadOldTweets(oldestTweetId, tagFilter ? [tagFilter] : undefined);
	if (result.error) {
		console.error(result.error);
		return {
			...state,
			hasMoreOldTweets: false
		}
	} else {
		if (result.tweets!.length === 0) {
			return {
				...state,
				hasMoreOldTweets: false
			}
		} else {
			return {
				...state,
				tweets: [...state.tweets, ...result.tweets!]
			}
		}
	}
}

export const pushFrontTweetsReducer = async (state: TweetAppState, action: PayloadAction<void>) => {
	const newestTweetId: string = state[0].id!;
	const tagFilter = state.tagFilter;
	const result = await loadNewTweets(newestTweetId, tagFilter ? [tagFilter] : undefined);
	if (result.error) {
		console.error(result.error);
	} else {
		return {
			...state,
			tweets: [...result.tweets!, ...state.tweets]
		}
	}
}

export const setTweetsReducer = async (state: TweetAppState, action: PayloadAction<TweetWithTags[]>) => {
	return {
		...state,
		tweets: action.payload,
		hasMoreOldTweets: true
	}
}

export const deleteTweetReducer = async (state: TweetAppState, action: PayloadAction<WithPassword<string>>) => {
	const tweetId = action.payload.data;
	const password = action.payload.password;
	const error = await deleteTweet(tweetId, password);
	if (error) {
		console.error(error);
	} else {
		return {
			...state,
			tweets: state.tweets.filter(tweet => tweet.id !== tweetId)
		}
	}
}

export const postTweetReducer = async (state: TweetAppState, action: PayloadAction<TweetWithTags>) => {
	const tweet = action.payload;
	const error = await postTweet(tweet);
	if (error) {
		console.error(error);
	} else {
		const tagId = state.tagFilter;
		if (tagId && !tweet.tag_id_list.includes(tagId)) {
			const newState = {
				...state,
				tagFilter: null
			}
			return reloadTweetsReducer(newState, { type: '' });
		} else {
			return loadNewTweetsReducer(state, { type: '' });
		}
	}
}