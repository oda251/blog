import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TagMap } from "../../../types/Tweet";

export interface TagsSliceState {
	tags: TagMap;
}

export const initialState: TagsSliceState = {
	tags: {},
}

const tagsSlice = createSlice({
	name: 'tags',
	initialState: initialState,
	reducers: {
		setTags: (state: TagsSliceState, action: PayloadAction<TagMap>) => {
			state.tags = action.payload;
		},
	},
})

export const { setTags } = tagsSlice.actions;
export const TagsReducer = tagsSlice.reducer;