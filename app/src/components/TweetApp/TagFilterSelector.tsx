import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { applyTagFilterAction } from "./thunk/setTagFilter";

interface TagSelectorProps {
}

const TagFilterSelector: React.FC<TagSelectorProps> = () => {
  const tagMap = useSelector((state: RootState) => state.tag.tags);
  const selected = useSelector((state: RootState) => state.tweet.tagFilter);
  const dispatch = useDispatch<AppDispatch>();

  return (
	<div className="w-full mt-4 pl-3 flex flex-wrap text-slate-400 items-center pb-2 items-center">
        <i className="fa-solid fa-tag text-slate-300 text-md mr-1"></i>
		{Object.entries(tagMap).map(([tagId, tagName]) => (
		<button
			key={tagId}
			className={`text-sm ml-1 px-2 border-slate-500 border rounded-md ${
				selected === tagId ? 'text-white bg-blue-500' : 'text-gray-500'
			}`}
			onClick={() => {
				if (selected === tagId) {
					dispatch(applyTagFilterAction(null));
				} else {
					dispatch(applyTagFilterAction(tagId));
				}
			}}
		>
			{tagName}
		</button>
		))}
	</div>
  );
};

export default TagFilterSelector;
