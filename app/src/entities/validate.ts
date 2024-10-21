import type { TweetWithTags } from "../types/Tweet";

export function validateTweet(tweet: TweetWithTags | null) {
	if (!tweet) {
		throw new Error('tweet is null');
	}
	if (!tweet.content) {
		throw new Error('content is null');
	}
	if (tweet.content.length > 512) {
		throw new Error('content is too long');
	}
	if (tweet.author.length > 32) {
		throw new Error('author is too long');
	}
}