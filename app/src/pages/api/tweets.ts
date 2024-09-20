import type { APIRoute } from "astro";
import tweetRepository from "../../repository/tweetRepository";
import type { TweetWithTags } from "../../entities/types/Tweet";
import { validateTweet } from "../../entities/validate";

export const GET: APIRoute = async ({ url }) => {
	const oldId = url.searchParams.get("oldId");
	const newId = url.searchParams.get("newId");
	const tagId = url.searchParams.get("tagId");

	if (oldId && newId) {
		return new Response(JSON.stringify({ error: "Both oldId and newId are set" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	try {
		let tweets: TweetWithTags[];
		if (!newId) {
			tweets = await tweetRepository.fetchTweetsByOldId(oldId, tagId);
		} else {
			tweets = await tweetRepository.fetchTweetsByNewId(newId, tagId);
		}
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
	const tweet = await request.json() as TweetWithTags;
	try {
		validateTweet(tweet);
	} catch (error) {
		return new Response(JSON.stringify({ error: `Invalid Tweet: {error.message}` }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	try {
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