import React, { useCallback, useRef, useEffect, useLayoutEffect, useState, useContext } from "react";
import TweetView from "./TweetView";
import { VariableSizeList as List } from "react-window";
import type { TweetAppState } from "./TweetApp";
import useWindowWidth from "../../utils/useWindowWidth";
import TweetContext from "./TweetContext";

interface TweetListProps {
  state: TweetAppState;
}

const TweetList: React.FC<TweetListProps> = ({ state }) => {
  const pageSize = 30;
  const windowWidth = useWindowWidth();
  const sizeMap = useRef(new Map<number, number>()); // 各アイテムの高さを保存するMap
  const listRef = useRef<List>(null);
  const loadMoreTweets = useContext(TweetContext).loadMoreTweets;

  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (
        state.tweets.length % pageSize === 0 &&
        visibleStopIndex === state.tweets.length - 1 &&
        state.hasMore
      ) {
        if (loadMoreTweets) loadMoreTweets();
      }
    },
    [state.tweets.length, state.hasMore, loadMoreTweets]
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
          tweet={state.tweets[index]}
          key={state.tweets[index].id}
          className="border-b border-slate-500"
        />
      </div>
    );
  };

  return (
    <div className="max-w-xl w-full px-6 mx-auto flex flex-col items-center justify-center p-4">
      <List
        ref={listRef}
        height={700}
        itemCount={state.tweets.length}
        itemSize={getItemSize}
        width="100%"
        onItemsRendered={handleItemsRendered}
        className="hide-scrollbar shadow-md rounded-lg overflow-hidden"
      >
        {Row}
      </List>
      <p className="mt-4 text-sm text-gray-500">{state.debugInfo}</p>
    </div>
  );
};

export default TweetList;