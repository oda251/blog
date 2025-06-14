import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { applyTagFilterAction } from './thunk/setTagFilter';

interface TagSelectorProps {}

const TagFilterSelector: React.FC<TagSelectorProps> = () => {
  const tagMap = useSelector((state: RootState) => state.tag.tags);
  const selected = useSelector((state: RootState) => state.tweet.tagFilter);
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = React.useState('');

  // Filter tags by search query (case-insensitive)
  const filteredTags = Object.entries(tagMap).filter(([, tagName]) =>
    tagName.toLowerCase().includes(search.toLowerCase())
  );

  // Ref for the whole row container
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = rowRef.current;
    if (el) {
      setOverflowing(el.scrollWidth > el.clientWidth + 2);
    }
  }, [filteredTags.length, search]);

  return (
    <div
      ref={rowRef}
      className="w-full mt-4 pl-3 pr-6 flex flex-nowrap text-slate-400 items-center pb-2 relative overflow-hidden"
      style={{
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        width: '100%',
        minHeight: '2.5rem',
      }}
    >
      {/* Tag icon */}
      <i className="fa-solid fa-tag items-center justify-center self-center text-slate-300 text-md mr-1 flex-shrink-0"></i>
      {/* Search box */}
      <div className="flex-shrink-0">
        <TagFilterSearch search={search} setSearch={setSearch} />
      </div>
      {/* Tag buttons */}
      {filteredTags.map(([tagId, tagName]) => (
        <button
          key={tagId}
          className={`text-sm ml-1 px-2 border-slate-500 border rounded-md h-6 inline-flex items-center ${
            selected === tagId ? 'text-white bg-blue-500' : 'text-gray-500'
          }`}
          style={{ verticalAlign: 'top', marginBottom: 0 }}
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
      {overflowing && (
        <span
          className="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-[#13151a] to-transparent pl-2 pr-3 text-xl font-bold pointer-events-none select-none"
          style={{
            height: '2.5rem',
            alignItems: 'center',
            display: 'flex',
          }}
          aria-label="More tags"
        >
        </span>
      )}
    </div>
  );
};

// Compact search component for tag filter
const TagFilterSearch: React.FC<{
  search: string;
  setSearch: (v: string) => void;
}> = ({ search, setSearch }) => {
  const [expanded, setExpanded] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Collapse input on blur if empty
  const handleBlur = () => {
    if (!search) setExpanded(false);
  };

  // Expand input on icon or input focus
  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className={`relative flex items-center transition-all duration-200 ${
        expanded ? 'w-40' : 'w-8'
      } h-8`}
      style={{ minWidth: expanded ? 120 : 32 }}
    >
      {/* Swap: Magnifying glass after input */}
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={handleExpand}
        onBlur={handleBlur}
        placeholder="search"
        className={`text-sm border rounded-md pl-2 pr-7 bg-white transition-all duration-200 h-8
          ${expanded ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0 border-transparent'}
        `}
        style={{
          minWidth: expanded ? 80 : 0,
          maxWidth: expanded ? 160 : 0,
          paddingRight: expanded ? 28 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          height: '2rem',
          lineHeight: '2rem',
          paddingTop: 0,
          paddingBottom: 0,
        }}
      />
      <button
        type="button"
        aria-label="Search tags"
        className="absolute right-2 text-slate-400 text-md focus:outline-none"
        tabIndex={expanded ? -1 : 0}
        onClick={handleExpand}
        style={{ pointerEvents: expanded ? 'none' : 'auto' }}
      >
        <i className="fa fa-search text-md" />
      </button>
    </div>
  );
};

export default TagFilterSelector;
