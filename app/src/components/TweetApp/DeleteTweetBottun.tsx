import React from "react";

interface TagSelectorProps {
  tweetId: string;
  deleteTweet: (tweetId: string, password: string) => void;
  className?: string;
}

const DeleteTweetButton: React.FC<TagSelectorProps> = ({ tweetId, deleteTweet, className }) => {
  return (
	<button
		className={className}
		onClick={
			() => {
				const password = prompt("パスワードを入力してください");
				if (password) {
					try {
						deleteTweet(tweetId, password);
					} catch (e) {
						alert(e);
					}
				}
			}
		}
	>
		<i className="fa-solid fa-trash"></i>
	</button>
  );
};

export default DeleteTweetButton;