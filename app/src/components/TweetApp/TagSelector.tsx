// TagSelector: タグ追加＋インクリメンタルサーチUI＋API連携
import React, { useState, useMemo } from 'react';
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
  // Reduxからタグ一覧取得
  const tagMap = useSelector((state: RootState) => state.tag.tags);

  // ローカル状態
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<{ [id: string]: string }>(tagMap);

  // ReduxのtagMapが変わったらローカルにも反映
  React.useEffect(() => {
    setLocalTags(tagMap);
  }, [tagMap]);

  // インクリメンタルサーチ: 入力値で部分一致
  const filteredTags = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return Object.entries(localTags);
    return Object.entries(localTags).filter(([_, name]) =>
      name.toLowerCase().includes(q)
    );
  }, [input, localTags]);

  // 既存タグに同名があるか
  const isDuplicate = Object.values(localTags)
    .map((name) => name.toLowerCase())
    .includes(input.trim().toLowerCase());

  // タグ追加
  const handleAddTag = async () => {
    setError(null);
    const name = input.trim();
    if (!name) {
      setError('タグ名を入力してください');
      return;
    }
    if (name.length > 32) {
      setError('タグ名は32文字以内で入力してください');
      return;
    }
    if (isDuplicate) {
      setError('同じ名前のタグが既に存在します');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'タグ追加に失敗しました');
        setAdding(false);
        return;
      }
      const tag = await res.json(); // { id, name }
      setLocalTags((prev) => ({ ...prev, [tag.id]: tag.name }));
      setInput('');
    } catch (e: any) {
      setError('通信エラーが発生しました');
    } finally {
      setAdding(false);
    }
  };

  // Enterキーで追加
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="タグ検索・追加"
          className="border rounded px-2 py-1"
          style={{ color: "#000" }}
          maxLength={32}
          disabled={adding}
        />
        <button
          onClick={handleAddTag}
          disabled={adding || !input.trim() || isDuplicate}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          新規タグ追加
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      <div className="flex flex-wrap">
        {filteredTags.length === 0 ? (
          <span className="text-gray-400">該当タグなし</span>
        ) : (
          filteredTags.map(([tagId, tagName]) => (
            <button
              key={tagId}
              className={`${className}  ${
                isSelected(tagId) ? classNameSelected : classNameUnselected
              }`}
              onClick={() => onClick(tagId)}
            >
              {tagName}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TagSelector;
