import axios from 'axios';
import type { Result } from '../../../types/Result';

export async function deleteTweet(
  tweetId: string,
  password: string
): Promise<Result<void>> {
  const url = `/api/tweets?tweetId=${tweetId}`;
  let result: Result<void> = { status: 200, data: undefined };
  try {
    await axios.delete(url, { headers: { password } });
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        result.status = error.response.status;
        result.error = error.response.data;
        return result;
      } else {
        result.status = -1;
        result.error = error.message;
        return result;
      }
    } else {
      result.status = -1;
      result.error = error.message;
      return result;
    }
  }
}
