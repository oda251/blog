import React, { useCallback, useRef, useEffect } from 'react';
import TweetView from './TweetView';
import { VariableSizeList as List } from 'react-window';
import useWindowWidth from '../../utils/useWindowWidth';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { loadOlderTweetsAction } from './thunk/loadTweet';

interface TweetListProps {
  className?: string;
}

const TweetList: React.FC<TweetListProps> = ({ className }) => {
  const pageSize = 30;
  const windowWidth = useWindowWidth();
  const tweets = useSelector((state: RootState) => state.tweet.tweets);
  const sizeMap = useRef(new Map<number, number>()); // 各アイテムの高さを保存するMap
  const listRef = useRef<List>(null);
  const hasMoreOldTweets = useRef<boolean>(true);
  const isLoading = useRef<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleItemsRendered = useCallback(
    async ({ visibleStopIndex }) => {
      if (
        !isLoading.current &&
        hasMoreOldTweets.current &&
        tweets.length % pageSize === 0 &&
        visibleStopIndex === tweets.length - 1
      ) {
        isLoading.current = true;
        const updated = await dispatch(
          loadOlderTweetsAction(tweets[tweets.length - 1].id)
        );
        if (loadOlderTweetsAction.fulfilled.match(updated)) {
          hasMoreOldTweets.current = updated.payload;
        } else if (loadOlderTweetsAction.rejected.match(updated)) {
          hasMoreOldTweets.current = false;
        }
        isLoading.current = false;
      }
    },
    [dispatch, tweets]
  );

  const getItemSize = (index: number) => {
    return sizeMap.current.get(index) || 100;
  };

  const Row = ({ index, style }) => {
    const ref = useRef<HTMLDivElement>(null);
    const prevHeightRef = useRef<number | null>(null);

    useEffect(() => {
      const updateHeight = () => {
        if (ref.current) {
          const height = ref.current.getBoundingClientRect().height;
          if (prevHeightRef.current !== height) {
            sizeMap.current.set(index, height);
            if (listRef.current) {
              listRef.current.resetAfterIndex(index);
            }
          }
        }
      };
      updateHeight();
    }, [index, windowWidth]);

    return (
      <div style={style}>
        <TweetView
          ref={ref}
          tweet={tweets[index]}
          key={tweets[index].id}
          className="border-b border-slate-500"
        />
      </div>
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center pb-1 ${className}`}
    >
      <List
        ref={listRef}
        height={700}
        itemCount={tweets.length}
        itemSize={getItemSize}
        width="100%"
        onItemsRendered={handleItemsRendered}
        className="hide-scrollbar shadow-md rounded-lg overflow-hidden"
      >
        {Row}
      </List>
    </div>
  );
};

export default TweetList;
