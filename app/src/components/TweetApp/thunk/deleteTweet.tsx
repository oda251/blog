import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface DeleteTweetPayload {
  tweetId: string;
  password: string;
}
interface DeleteTweetResult {
}

export const deleteTweet = createAsyncThunk<DeleteTweetResult, DeleteTweetPayload>(
  'tweets/delete',
  async ({tweetId, password}, {rejectWithValue}) => {
    const url = `/api/tweets?tweetId=${tweetId}`;
    return axios.delete(url, { headers: { password } })
      .then()
      .catch(error => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            return rejectWithValue({
              status: error.response?.status,
              error: error.response?.data,
            });
          } else {
            return rejectWithValue({
              status: -1,
              error: error.message,
            });
          }
        } else {
          return rejectWithValue({
            status: -1,
            error: error.message,
          });
        }
      });
  }
);