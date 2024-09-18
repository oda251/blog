import type { APIRoute } from "astro";
import TweetRepository from "../../repository/tweetRepository";
import type Tweet from "../../entities/types/Tweet";
import { validateTweet } from "../../entities/validate";

export const GET: APIRoute = async ({ url }) => {
	const lastId = url.searchParams.get("lastId");

	try {
		const tweetRepository: TweetRepository = new TweetRepository();
		const tweets = await tweetRepository.fetchTweetByLastId(lastId);
		return new Response(JSON.stringify(tweets), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		if (e instanceof Error) {
			return new Response(JSON.stringify({ error: e.message }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		} else {
			return new Response(JSON.stringify({ error: "Internal Server Error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
};

export const POST: APIRoute = async ({ request }) => {
	const tweet = await request.json() as Tweet;
	try {
		validateTweet(tweet);
	} catch (error) {
		return new Response(JSON.stringify({ error: `Invalid Tweet: {error.message}` }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	try {
		const tweetRepository: TweetRepository = new TweetRepository();
		await tweetRepository.postTweet(tweet);
		return new Response(JSON.stringify(tweet), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		if (e instanceof Error) {
			return new Response(JSON.stringify({ error: e.message }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		} else {
			return new Response(JSON.stringify({ error: "Internal Server Error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
}