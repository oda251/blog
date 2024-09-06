import { BigQuery } from '@google-cloud/bigquery';
import type Tweet from '../types/Tweet';
import type MyEnv from '../types/MyEnv';

class TweetRepository {
	private bigQuery: BigQuery;
	private datasetId: string;
	private tableId: string;
	private tweetsCache: Tweet[];
	private static pageSize: number = 20;

	constructor(env: MyEnv) {
		try {
			this.bigQuery = new BigQuery();
		} catch (error) {
			console.log(`Failed to create BigQuery client.\n${error}`);
		}
		this.datasetId = env.BQ_DATASET_ID!;
		this.tableId = env.BQ_TABLE_ID!;
		this.tweetsCache = [];
	}

	async cacheTweets(): Promise<boolean> {
		const query = `
			SELECT *
			FROM ${this.datasetId}.${this.tableId}
			ORDER BY created_at DESC
			`;
		const options = {
			query: query,
			useLegacySql: false,
		};
		try {
			const [job] = await this.bigQuery.createQueryJob(options);
			const [rows] = await job.getQueryResults();
			this.tweetsCache = rows as Tweet[];
			return true;
		} catch (error) {
			return false
		}
	}

	getTweets(page: number) : Tweet[] {
		if (page < 1) return [];
		const start = (page - 1) * TweetRepository.pageSize;
		const end = start + TweetRepository.pageSize;
		return this.tweetsCache.slice(start, end);
	}

	getPageCount() : number {
		return Math.ceil(this.tweetsCache.length / TweetRepository.pageSize);
	}

	async postTweet(tweet: Tweet) : Promise<void> {
		const query = `
			INSERT INTO ${this.datasetId}.${this.tableId} (id, content, author, ip_address, created_at)
			VALUES ('${tweet.id}', '${tweet.content}', '${tweet.author}', '${tweet.ip_address}', '${tweet.created_at}')
		`;
		const options = {
			query: query,
			useLegacySql: false,
		};
		try {
			const [job] = await this.bigQuery.createQueryJob(options);
			const [rows] = await job.getQueryResults();
			this.tweetsCache = [tweet, ...this.tweetsCache];
		} catch (error) {
			
		}
	}
}

const tweetRepository = new TweetRepository();
if (await tweetRepository.cacheTweets()) {
	console.log('Tweets cached');
} else {
	console.log('Failed to cache tweets');
	exit(1);
}

export default tweetRepository;