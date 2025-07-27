-- Minimal sample data for tweets, tags, and tweets_tags

-- Insert a tag
INSERT INTO tags (name) VALUES ('sample');

-- Insert a tweet
INSERT INTO tweets (content, article, author, ip_address)
VALUES ('Hello world!', 'This is a sample article.', 'demo', '127.0.0.1');

-- Link the tweet and tag
INSERT INTO tweets_tags (tweet_id, tag_id)
VALUES (
  (SELECT id FROM tweets WHERE content = 'Hello world!' LIMIT 1),
  (SELECT id FROM tags WHERE name = 'sample' LIMIT 1)
);