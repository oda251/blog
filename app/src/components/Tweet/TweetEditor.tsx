import type Tweet from "../../entities/types/Tweet";
import React, { useState } from "react";
import axios from "axios";
import { validateTweet } from "../../entities/validate";
import useWindowWidth from "../../utils/useWindowWidth";
import { TweetWithTags } from "../../entities/types/Tweet";
import TweetContext from "./TweetContext";

interface TweetEditorProps {
}

const TweetEditor: React.FC<TweetEditorProps> = () => {
  const [tweet, setTweet] = useState<TweetWithTags>({
    content: "",
    author: "",
    ip_address: "",
    created_at: "",
    tagIds: [],
  });
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tagMap = React.useContext(TweetContext).tagMap!;
  const [tagSelection, setTagSelection] = useState<Map<number, boolean>>(new Map());
  const reloadTweets = React.useContext(TweetContext).reloadTweets;

  const postTweet = async (): Promise<void> => {
    if (isPosting) return;

    setIsPosting(true);
    try {
      validateTweet(tweet);
      setErrorMessage(null);
      const response = await axios.post("/api/tweets", tweet, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setTweet({
          ...tweet,
          author: "",
          content: "",
        });
        if (reloadTweets) reloadTweets();
      } else {
        console.log(response.data);
        throw new Error("Server error");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleTagSelection = (tagId: number): void => {
    setTagSelection(new Map(tagSelection.set(tagId, !tagSelection.get(tagId))));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg w-4/5 sm:w-full">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tweet.author}
          onChange={(e) => setTweet({ ...tweet, author: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tweet.content}
          onChange={(e) => setTweet({ ...tweet, content: e.target.value })}
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
        <div className="flex flex-wrap">
          {Array.from(tagMap.entries()).map(([tagId, tagName]) => (
            <button
              key={tagId}
              className={`text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded-md mr-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => toggleTagSelection(tagId)}
            >
              {tagName}
            </button>
          ))}
        </div>
      </div>
      <button
        className={`w-full text-white py-2 rounded-md ${
          isPosting ? "bg-slate-500" : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        }`}
        onClick={postTweet}
      >
        {isPosting ? "Posting..." : "Post"}
      </button>
      {errorMessage && <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default TweetEditor;