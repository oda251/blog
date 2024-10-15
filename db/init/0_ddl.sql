CREATE TABLE IF NOT EXISTS tweets (
    id SERIAL PRIMARY KEY,
    content VARCHAR(1024) NOT NULL,
    article VARCHAR(16384),
    author VARCHAR(128),
    ip_address VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tweets_tags (
    tweet_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (tweet_id, tag_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
