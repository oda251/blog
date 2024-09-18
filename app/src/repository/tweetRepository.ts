import type Tweet from '../entities/types/Tweet';
import pg from 'pg';
import moment from 'moment-timezone';
import { validateTweet } from '../entities/validate';

const { Client } = pg;

class TweetRepository {
	private client: InstanceType<typeof Client>;
	private static pageSize: number = 30;

	constructor() {
		const url = process.env.DATABASE_URL;
		if (!url) {
			throw new Error('DATABASE_URL is not set');
		}
		this.client = new Client(url);
	}

	async fetchAllTweet(): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM tweets
			ORDER BY created_at DESC;
			`;
		await this.client.connect();
		const result = await this.client.query(query);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
		})) as Tweet[];
	}

	async fetchTweetByPage(page: number): Promise<Tweet[]> {
		const baseQuery = `
			SELECT *
			FROM tweets
			ORDER BY created_at DESC
			LIMIT ${TweetRepository.pageSize}
		`;
		const offset = page ? `OFFSET ${TweetRepository.pageSize * (page - 1)}` : '';
		const query = `${baseQuery} ${offset};`
		await this.client.connect();
		const result = await this.client.query(query);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
		})) as Tweet[];
	}

	async fetchNewTweet(date: string): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM tweets
			WHERE created_at >= '${date}'
			ORDER BY created_at DESC;
		`;
		await this.client.connect();
		const result = await this.client.query(query);
		return result.rows.map((row: any) => ({
			...row,
			created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
		})) as Tweet[];
	}
	

	async postTweet(tweet: Tweet) : Promise<void> {
		validateTweet(tweet);
		const query = `
			INSERT INTO tweets (content, author, ip_address)
			VALUES ('${tweet.content}', '${tweet.author}', '${tweet.ip_address}');
		`;
		await this.client.connect();
		await this.client.query(query);
	}
}

export default TweetRepository;