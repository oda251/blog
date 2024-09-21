import type { TagMap, TweetWithTags } from "../entities/types/Tweet";

class TweetCache {
	private tags: TagMap;
	private tweets: Map<string | null, TweetWithTags[]>;

	constructor() {
		this.tags = new Map();
		this.tweets = new Map();
	}

	getTags(): TagMap {
		return this.tags;
	}
	getTweets(tagId?: string | null): TweetWithTags[] | undefined {
		if (tagId === undefined) {
			tagId = null;
		}
		return this.tweets.get(tagId);
	}

	setTags(tags: TagMap): void {
		this.tags = tags;
	}
	setTweets(tagId: string | null | undefined, tweets: TweetWithTags[]): void {
		if (tagId === undefined) {
			tagId = null;
		}
		this.tweets.set(tagId, tweets);
	}

	resetTweets(target: string[]): void {
		this.tags.forEach((id, name) => {
			if (id === null || target.includes(id)) {
				this.tweets.delete(id);
			}
		});
	}
}

export default TweetCache;