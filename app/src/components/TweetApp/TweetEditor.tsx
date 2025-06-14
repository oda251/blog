import React, { useState } from 'react';
import { validateTweet } from '../../entities/validate';
import type { TweetWithTags } from '../../types/Tweet';
import TagSelector from './TagSelector';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { postTweetAction } from './thunk/postTweet';

interface TweetEditorProps {
  className?: string;
}

const TweetEditor: React.FC<TweetEditorProps> = ({ className }) => {
  const [tweet, setTweet] = useState<TweetWithTags>({
    id: '',
    content: '',
    author: '',
    ip_address: '',
    created_at: '',
    tag_id_list: [],
  });
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagSelection, setTagSelection] = useState<Map<string, boolean>>(
    new Map()
  );
  const dispatch = useDispatch<AppDispatch>();

  const onClick = async (): Promise<void> => {
    if (isPosting) return;
    setIsPosting(true);
    try {
      validateTweet(tweet);
      await dispatch(postTweetAction(tweet));
      setTweet({
        id: '',
        content: '',
        author: '',
        ip_address: '',
        created_at: '',
        tag_id_list: [],
      });
      setTagSelection(new Map());
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleTagSelection = (tagId: string): void => {
    setTagSelection((prev) => {
      const newSelection = new Map(prev);
      newSelection.set(tagId, !prev.get(tagId));
      setTweet((tw) => ({
        ...tw,
        tag_id_list: Array.from(newSelection.entries())
          .filter(([, isSelected]) => isSelected)
          .map(([id]) => id),
      }));
      return newSelection;
    });
  };
  const tagSelectorIsSelected = (tagId: string): boolean =>
    tagSelection.get(tagId) || false;

  return (
    <div
      className={`max-w-md mx-auto p-6 bg-white shadow-md rounded-lg w-[95%] ${className}`}
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Author
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tweet.author}
          onChange={(e) => setTweet({ ...tweet, author: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Content
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tweet.content}
          onChange={(e) => setTweet({ ...tweet, content: e.target.value })}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tags
        </label>
        <TagSelector
          isSelected={tagSelectorIsSelected}
          onClick={toggleTagSelection}
          className="text-xs mb-1 px-1 py-0.5 mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          classNameSelected="bg-blue-500 text-white"
          classNameUnselected="bg-gray-200 text-gray-700"
        />
      </div>
      <button
        className={`w-full text-white py-2 rounded-md ${
          isPosting
            ? 'bg-slate-500'
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
        onClick={onClick}
      >
        {isPosting ? 'Posting...' : 'Post'}
      </button>
      {errorMessage && (
        <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default TweetEditor;
