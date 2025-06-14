import type { TagMap, TweetWithTags } from '../types/Tweet';

class TweetCache {
  private tags: TagMap;
  private tweets: Map<string | null, TweetWithTags[]>;

  constructor() {
    this.tags = {};
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
    this.tweets.delete(null);
    if (!target || target.length === 0) {
      return;
    }
    Object.entries(this.tags).forEach(([id, _]) => {
      if (target.includes(id)) {
        this.tweets.delete(id);
      }
    });
  }
}

export default TweetCache;
