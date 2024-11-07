import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { deleteTweetAction } from "./thunk/deleteTweet";

interface TagSelectorProps {
  tweetId: string;
  className?: string;
}

const DeleteTweetButton: React.FC<TagSelectorProps> = ({ tweetId, className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isClicked, setIsClicked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const removeError = async () => {
	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	await wait(3000);
	setError("");
  }

  const handleDelete = async () => {
	const result = await dispatch(deleteTweetAction({ tweetId, password }));
	if (deleteTweetAction.rejected.match(result)) {
		const payload = result.payload as { status?: number; error?: string };
		setError(payload.error || "Unknown error");
		await removeError();
	}
  };

  const reset = () => {
	setIsClicked(false);
	setPassword("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleDelete();
      reset();
    }
  }

  return (
    <div className={`flex ${className}`}>
	  {error.length > 0 && <p className="text-red-600 text-xs mr-2">{error}</p>}
      {isClicked ? (
		<div>
			<input
				type="password"
				placeholder="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="border rounded px-2 py-1 w-24"
				onKeyDown={handleKeyDown}
			/>
			<button
				onClick={() => {
					handleDelete();
					reset();
				}}
				className="px-1"
			>
				<i className="fa-solid fa-check text-green-600"></i>
			</button>
			<button
				onClick={() => {
					reset();
				}}
			>
				<i className="fa-solid fa-times text-red-600"></i>
			</button>
		</div>
      ) : (
        <button
          onClick={() => setIsClicked(true)}
          className="flex items-center justify-center"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      )}
    </div>
  );
};

export default DeleteTweetButton;