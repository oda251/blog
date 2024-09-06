import type { APIRoute } from "astro";
import tweetRepository from "../../../../workers/repository/tweetRepository";

export const get: APIRoute = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const tweets = tweetRepository.getTweets(parseInt(page));

	return new Response(JSON.stringify(tweets), {
		status: 200,
		headers: {
			"content-type": "application/json",
		},
	});
};