import { BigQuery } from '@google-cloud/bigquery';
import type Tweet from '../entities/types/Tweet';
import credentials from '../../credential.json';

class TweetRepository {
	private bigQuery: BigQuery;
	private datasetId: string;
	private tableId: string;
	private static pageSize: number = 20;

	constructor() {
		// const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
		this.bigQuery = new BigQuery({
			projectId: credentials.project_id,
			credentials: {
				client_email: credentials.client_email,
				private_key: credentials.private_key,
			},
		});
		this.datasetId = process.env.BQ_DATASET_ID!;
		this.tableId = process.env.BQ_TABLE_ID!;
	}

	async fetchAllTweet(): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM ${this.datasetId}.${this.tableId}
			ORDER BY created_at DESC
			`;
		const options = {
			query: query,
			useLegacySql: false,
		};
		const [job] = await this.bigQuery.createQueryJob(options);
		const [rows] = await job.getQueryResults();
		return rows as Tweet[];
	}

	async fetchTweetByPage(page: number): Promise<Tweet[]> {
		const query = `
			SELECT *
			FROM ${this.datasetId}.${this.tableId}
			ORDER BY created_at DESC
			LIMIT ${TweetRepository.pageSize}
			OFFSET ${TweetRepository.pageSize * (page - 1)}
		`;
		const options = {
			query: query,
			useLegacySql: false,
		};
		const [job] = await this.bigQuery.createQueryJob(options);
		const [rows] = await job.getQueryResults();
		return rows as Tweet[];
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
		console.log(tweet);
		const [job] = await this.bigQuery.createQueryJob(options);
		await job.promise();
		const [metadata] = await job.getMetadata();
		if (metadata.status.errorResult) {
			throw new Error(metadata.status.errorResult.message);
		}
	}
}

export default TweetRepository;