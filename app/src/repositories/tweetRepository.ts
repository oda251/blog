import { PrismaClient, type Tweets, type Tags } from '@prisma/client';
import { validateTweet } from '@entities/validate';

class TweetRepository {
  private prisma: PrismaClient;
  private static pageSize: number = 30;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async fetchTweetById(tweetId: string): Promise<Tweets> {
    const tweet = await this.prisma.tweets.findUnique({
      where: { id: tweetId },
      include: {
        tags: true,
      },
    });
    if (!tweet) {
      throw new Error('Tweet not found');
    }
    return tweet;
  }

  async fetchTags(limits: number = 10): Promise<Tags[]> {
    const tags = await this.prisma.tags.findMany({
      take: limits,
    });
    return tags;
  }

  // 古いツイートを取得。ページネーションの文脈。
  async fetchOlderTweets(
    cursorId?: string | null,
    tagId?: string | null
  ): Promise<Tweets[]> {
    const take = TweetRepository.pageSize;

    const tweets = await this.prisma.tweets.findMany({
      where: {
        tags: tagId ? { some: { id: tagId } } : undefined,
      },
      include: { tags: true },
      orderBy: { created_at: 'desc' },
      take,
      ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    });

    return tweets;
  }

  // 新しいツイートを取得。
  async fetchNewTweets(
    tagId?: string | null,
    cursorId?: string | null
  ): Promise<Tweets[]> {
    const take = TweetRepository.pageSize;

    const tweets = await this.prisma.tweets.findMany({
      where: {
        tags: tagId ? { some: { id: tagId } } : undefined,
      },
      include: { tags: true },
      orderBy: { created_at: 'asc' },
      take,
      ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    });
    return tweets.reverse();
  }

  async postTweet(tweet: Tweets, tags: Tags[]): Promise<void> {
    validateTweet(tweet);
    this.prisma.tweets.create({
      data: {
        content: tweet.content,
        author: tweet.author,
        ip_address: tweet.ip_address,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  async deleteTweet(tweetId: string): Promise<void> {
    this.prisma.tweets.delete({
      where: { id: tweetId },
    });
  }
}

export default TweetRepository;
