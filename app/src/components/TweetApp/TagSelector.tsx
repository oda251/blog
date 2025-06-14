import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

interface TagSelectorProps {
  className?: string;
  classNameSelected?: string;
  classNameUnselected?: string;
  isSelected: (tagId: string) => boolean;
  onClick: (tagId: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  isSelected,
  onClick,
  className,
  classNameSelected,
  classNameUnselected,
}) => {
  const tagMap = useSelector((state: RootState) => state.tag.tags);

  return (
    <div className="flex flex-wrap">
      {Object.entries(tagMap).map(([tagId, tagName]) => (
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
