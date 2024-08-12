import AWS from 'aws-sdk';

AWS.config.update({
	region: 'us-west-2', // your region
	accessKeyId: 'your_access_key_id',
	secretAccessKey: 'your_secret_access_key'
});

const db = new AWS.DynamoDB.DocumentClient();