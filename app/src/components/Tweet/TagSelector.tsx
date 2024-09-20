import React from "react";
import TweetContext from "./TweetContext";

interface TagSelectorProps {
  isSelected: (tagId: string) => boolean;
  onClick: (tagId: string) => void;
  className?: string;
  classNameSelected?: string;
  classNameUnselected?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({ isSelected, onClick, className, classNameSelected, classNameUnselected }) => {
  const tagMap = React.useContext(TweetContext).tagMap!;

  return (
	<div className="flex flex-wrap">
		{Array.from(tagMap.entries()).map(([tagId, tagName]) => (
		<button
			key={tagId}
			className={`${className}  ${
			isSelected(tagId) ? classNameSelected : classNameUnselected
			}`}
			onClick={() => onClick(tagId)}
		>
			{tagName}
		</button>
		))}
	</div>
  );
};

export default TagSelector;