import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteTweet } from '../repository/deleteTweet';
import { removeTweet } from '../slice/tweets';
import type { Result } from '../../../types/Result';

export interface DeleteTweetPayload {
  tweetId: string;
  password: string;
}

export const deleteTweetAction = createAsyncThunk<
  Result<void>,
  DeleteTweetPayload
>(
  'tweets/delete',
  async ({ tweetId, password }, { rejectWithValue, dispatch }) => {
    const result = await deleteTweet(tweetId, password);
    if (result.status === 200) {
      dispatch(removeTweet(tweetId));
      return result;
    } else {
      return rejectWithValue(result.error);
    }
  }
);
