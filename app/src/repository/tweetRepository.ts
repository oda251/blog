import type { Tag, TagMap, TweetWithTags } from '../entities/types/Tweet';
import pg from 'pg';
import moment from 'moment-timezone';
import { validateTweet } from '../entities/validate';
import TweetCache from './tweetCache';
import DeleteTweetButton from '../components/TweetApp/DeleteTweetBottun';

const { Client } = pg;

class TweetRepository {
	private client: InstanceType<typeof Client>;
	private static pageSize: number = 30;
	private cache: TweetCache;

	constructor() {
		const url = process.env.DATABASE_URL;
		if (!url) {
			throw new Error('DATABASE_URL is not set');
		}
		this.client = new Client(url);
		this.cache = new TweetCache();
	}

	async initialize() {
		await this.client.connect();
		this.cache.setTags(await this.fetchTags());
	}

	async fetchTweetsByOldId(oldId: string | null, tagId?: string | null): Promise<TweetWithTags[]> {
		if (!oldId) {
			const tweets = this.cache.getTweets(tagId);
			if (tweets) {
				return tweets;
			}
		}
		let query: string;
		let params: any[];
		if (tagId) {
			if (oldId) {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tag_id_list
					FROM tweets t
					JOIN tweets_tags tt ON t.id = tt.tweet_id
					WHERE t.id < $1 AND tt.tag_id = $2
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $3;
				`;
				params = [oldId, tagId, TweetRepository.pageSize];
			  } else {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tag_id_list
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
			if (oldId) {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tag_id_list
					FROM tweets t
					LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
					WHERE t.id < $1
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $2;
			  	`;
				params = [oldId, TweetRepository.pageSize];
			} else {
				query = `
					SELECT t.*, array_agg(tt.tag_id) as tag_id_list
					FROM tweets t
					LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
					GROUP BY t.id
					ORDER BY t.created_at DESC
					LIMIT $1;
				`;
				params = [TweetRepository.pageSize];
			}
		}
        const result: pg.QueryResult<TweetWithTags> = await this.client.query(query, params);
        const tweets = result.rows.map((row: any) => ({
            ...row,
            created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
			tag_id_list: row.tag_id_list[0] ? row.tag_id_list : []
        })) as TweetWithTags[];
		if (!oldId) {
			this.cache.setTweets(tagId, tweets);
		}
		return tweets;
    }

	async fetchTags(): Promise<Map<string, string>> {
		let tags: Map<string, string>;
		tags = this.cache.getTags();
		if (tags) {
			return tags;
		}
		const query = `
			SELECT *
			FROM tags;
		`;
		const result: pg.QueryResult<Tag> = await this.client.query(query);
		tags = new Map<string, string>();
		for (const row of result.rows) {
			tags.set(row.id!, row.name);
		}
		return tags;
	}

	async fetchTweetsByNewId(newId: string, tagId?: string | null): Promise<TweetWithTags[]> {
		let query: string;
		let params: any[];
		if (tagId) {
			query = `
				SELECT t.*, array_agg(tt.tag_id) as tag_id_list
				FROM tweets t
				LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
				WHERE t.id > $1 AND tt.tag_id = $2
				GROUP BY t.id
				ORDER BY t.created_at DESC
				LIMIT $3;
			`;
			params = [newId, tagId, TweetRepository.pageSize];
		} else {
			query = `
				SELECT t.*, array_agg(tt.tag_id) as tag_id_list
				FROM tweets t
				LEFT JOIN tweets_tags tt ON t.id = tt.tweet_id
				WHERE t.id > $1
				GROUP BY t.id
				ORDER BY t.created_at DESC
				LIMIT $2;
			`;
			params = [newId, TweetRepository.pageSize];
		}
		const result: pg.QueryResult<TweetWithTags> = await this.client.query(query, params);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
			tag_id_list: row.tag_id_list[0] ? row.tag_id_list : []
		})) as TweetWithTags[];
	}

	async postTweet(tweet: TweetWithTags) : Promise<void> {
		validateTweet(tweet);
		await this.client.query('BEGIN');
		try {
			const query = `
				INSERT INTO tweets (content, author, ip_address)
				VALUES ($1, $2, $3)
				RETURNING id;
			`;
			const result = await this.client.query(query, [tweet.content, tweet.author, tweet.ip_address]);
			const tweetId = result.rows[0].id;

			for (const tagId of tweet.tag_id_list) {
				const query = `
					INSERT INTO tweets_tags (tweet_id, tag_id)
					VALUES ($1, $2);
				`;
				await this.client.query(query, [tweetId, tagId]);
			}
			await this.client.query('COMMIT');
			this.cache.resetTweets(tweet.tag_id_list);
		} catch (e) {
			await this.client.query('ROLLBACK');
			throw e;
		}
	}

	async deleteTweet(tweetId: string) : Promise<void> {
		const target = await this.client.query('SELECT * FROM tweets WHERE id = $1', [tweetId]) as pg.QueryResult<TweetWithTags>;
		if (target.rows.length === 0) {
			throw new Error('Tweet not found');
		}
		const tweet = target.rows[0] as TweetWithTags;
		await this.client.query('BEGIN');
		try {
			const query = `
				DELETE FROM tweets_tags
				WHERE tweet_id = $1;
			`;
			await this.client.query(query, [tweetId]);
			const query2 = `
				DELETE FROM tweets
				WHERE id = $1;
			`;
			await this.client.query(query2, [tweetId]);
			await this.client.query('COMMIT');
			this.cache.resetTweets(tweet.tag_id_list);
		} catch (e) {
			await this.client.query('ROLLBACK');
			throw e;
		}
	}
}

const tweetRepository = new TweetRepository();
await tweetRepository.initialize();


export default tweetRepository;