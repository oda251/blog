import type Tweet from "../../entities/types/Tweet";
import React, { useState } from "react";
import axios from "axios";
import { validateTweet } from "../../entities/validate";
import useWindowWidth from "../../utils/useWindowWidth";

interface TweetEditorProps {
  reloadTweets?: () => void;
}

const TweetEditor: React.FC<TweetEditorProps> = ({ reloadTweets }) => {
  const [tweet, setTweet] = useState<Tweet>({
    content: "",
    author: "",
    ip_address: "",
    created_at: "",
  });
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const windowWidth = useWindowWidth();

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