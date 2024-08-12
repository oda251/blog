import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('blog.db')

const sql = `
	CREATE TABLE IF NOT EXISTS works (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		description TEXT,
		link TEXT,
		github TEXT,
	);
	CREATE TABLE IF NOT EXISTS infras (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		icon TEXT,
	);
	CREATE TABLE IF NOT EXISTS frameworks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		icon TEXT,
	);
	CREATE TABLE IF NOT EXISTS langs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		icon TEXT,
	);
`