import type { TweetWithTags } from '../../../entities/types/Tweet';

export interface TweetAppAction {
	type: 'load/old' | 'load/new' | 'reload' | 'delete' | 'set/tagFilter';
	payload: TweetWithTags[] | string | null;
}

export const loadOldTweetsAction = (tweets: TweetWithTags[]) => {
	return {
		type: 'load/old',
		payload: tweets,
	}
}

export const loadNewTweetsAction = (tweets: TweetWithTags[]) => {
	return {
		type: 'load/new',
		payload: tweets,
	}
}

export const reloadTweetsAction = (tweets: TweetWithTags[]) => {
	return {
		type: 'reload',
		payload: tweets,
	}
}

export const deleteTweetAction = (tweetId: string) => {
	return {
		type: 'delete',
		payload: tweetId,
	}
}

export const setTagFilterAction = (tagId: string | null) => ({
	type: 'set/tagFilter',
	payload: tagId,
})
