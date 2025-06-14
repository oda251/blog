import type { TweetWithTags } from '../../../types/Tweet';
import axios from 'axios';
import type { Result } from '../../../types/Result';

export async function postTweet(tweet: TweetWithTags): Promise<Result<void>> {
  let result: Result<void> = {
    status: 200,
    data: undefined,
  };
  try {
    await axios.post('/api/tweets', tweet);
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
