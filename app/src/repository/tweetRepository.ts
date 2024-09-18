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

	async fetchTweetByLastId(lastId: string | null): Promise<Tweet[]> {
		let query: string;
		let params: any[];
		if (lastId) {
			query = `
				SELECT *
				FROM tweets
				WHERE id < $1
				ORDER BY created_at DESC
				LIMIT $2;
			`;
			params = [lastId, TweetRepository.pageSize];
		} else {
			query = `
				SELECT *
				FROM tweets
				ORDER BY created_at DESC
				LIMIT $1;
			`;
			params = [TweetRepository.pageSize];
		}
        await this.client.connect();
        const result = await this.client.query(query, params);
        return result.rows.map((row: any) => ({
            ...row,
            created_at: moment(row.created_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
        })) as Tweet[];
    }

	async fetchNewTweet(date: string): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM tweets
			WHERE created_at >= $1
			ORDER BY created_at DESC;
		`;
		await this.client.connect();
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
		await this.client.connect();
		await this.client.query(query, [tweet.content, tweet.author, tweet.ip_address]);
	}
}

export default TweetRepository;