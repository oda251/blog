CREATE TABLE IF NOT EXISTS tweet.tweets (
	id INT64,
	content STRING(1024),
	author STRING(128),
	ip_address STRING(32),
	created_at TIMESTAMP,
	PRIMARY KEY(id) NOT ENFORCED
);
