import { createAsyncThunk } from "@reduxjs/toolkit";
import { setTagFilter } from "../slice/tweets";
import { reloadTweetsAction } from "./loadTweet";

export const applyTagFilterAction = createAsyncThunk<void, string | null>(
	'tweets/setTagFilter',
	async (tag, { dispatch }) => {
		dispatch(setTagFilter(tag));
		dispatch(reloadTweetsAction());
	}
);
