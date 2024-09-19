import type { Tweet, Tag, TweetWithTags } from '../entities/types/Tweet';
import pg from 'pg';
import moment from 'moment-timezone';
import { validateTweet } from '../entities/validate';

const { Client } = pg;

export let tagsCache: Map<number, string> = new Map<number, string>();

class TweetRepository {
	private client: InstanceType<typeof Client>;
	private static pageSize: number = 30;
	private tagsCache: Map<number, string>;

	constructor() {
		const url = process.env.DATABASE_URL;
		if (!url) {
			throw new Error('DATABASE_URL is not set');
		}
		this.client = new Client(url);
	}

	async initialize() {
		await this.client.connect();
		this.tagsCache = await this.fetchTags();
	}

	async fetchAllTweet(): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM tweets
			ORDER BY created_at DESC;
			`;
		const result = await this.client.query(query);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
		})) as Tweet[];
	}

	async fetchTweetByLastId(lastId: number | null, tagId?: number | null): Promise<TweetWithTags[]> {
		let query: string;
		let params: any[];
		let result: pg.QueryResult<TweetWithTags>;
		if (tagId) {
			if (lastId) {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tags
					FROM tweets t
					JOIN tweets_tags tt ON t.id = tt.tweet_id
					WHERE t.id < $1 AND tt.tag_id = $2
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $3;
				`;
				params = [lastId, tagId, TweetRepository.pageSize];
			  } else {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tags
					FROM tweets t
					JOIN tweets_tags tt ON t.id = tt.tweet_id
					WHERE tt.tag_id = $1
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $2;
				`;
				params = [tagId, TweetRepository.pageSize];
			  }
		} else {
			if (lastId) {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tags
					FROM tweets t
					LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
					WHERE t.id < $1
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $2;
			  	`;
				params = [lastId, TweetRepository.pageSize];
			} else {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tags
					FROM tweets t
					LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $1;
				`;
				params = [TweetRepository.pageSize];
			}
		}
        result = await this.client.query(query, params);
        return result.rows.map((row: any) => ({
            ...row,
            created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
        })) as TweetWithTags[];
    }

	async fetchTags(): Promise<Map<number, string>> {
		if (this.tagsCache) {
			return this.tagsCache;
		}
		const query = `
			SELECT *
			FROM tags;
		`;
		const result: pg.QueryResult<Tag> = await this.client.query(query);
		const tags = new Map<number, string>();
		for (const row of result.rows) {
			tags.set(row.id!, row.name);
		}
		return tags;
	}

	async fetchNewTweet(date: string): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM tweets
			WHERE created_at >= $1
			ORDER BY created_at DESC;
		`;
		const result = await this.client.query(query, [date]);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
		})) as Tweet[];
	}

	async postTweet(tweet: Tweet) : Promise<void> {
		validateTweet(tweet);
		const query = `
			INSERT INTO tweets (content, author, ip_address)
			VALUES ($1, $2, $3);
		`;
		await this.client.query(query, [tweet.content, tweet.author, tweet.ip_address]);
	}
}

const tweetRepository = new TweetRepository();
await tweetRepository.initialize();


export default tweetRepository;