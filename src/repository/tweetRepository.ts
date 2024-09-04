import { BigQuery } from '@google-cloud/bigquery';
import Tweet from '../entities/types/Tweet';

class TweetRepository {
	private bigQuery: BigQuery.BigQuery;
	private datasetId: string;
	private tableId: string;

	constructor() {
		this.bigQuery = new BigQuery.BigQuery();
		if (!process.env.BQ_DATASET_ID || !process.env.BQ_TABLE_ID)
			throw new Error('BQ_DATASET_ID and BQ_TABLE_ID must be set');
		this.datasetId = process.env.BQ_DATASET_ID!;
		this.tableId = process.env.BQ_TABLE_ID!;
	}

	async getTweets() : Promise<Tweet[]> {
		const query = `SELECT * FROM ${this.datasetId}.${this.tableId}`;
		const options = {
			query: query,
			useLegacySql: false,
		};
		const [job] = await this.bigQuery.createQueryJob(options);
		const [rows] = await job.getQueryResults<Tweet>();
		return rows;
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
		const result = await this.bigQuery.createQueryJob(options);
	}
}

const tweetRepository = new TweetRepository();

export default tweetRepository;