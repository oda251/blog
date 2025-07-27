CREATE TABLE IF NOT EXISTS vector (
    id SERIAL PRIMARY KEY,
    source_id INT NOT NULL,
    source_table VARCHAR(128) NOT NULL,
    embedding TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES tweets(id)
);
