import React, { useState } from 'react';
import TweetEditor from './TweetEditor'; // エディタコンポーネントのインポート

const ToggleTweetEditor: React.FC = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const toggleEditorVisibility = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={toggleEditorVisibility}
        className={`transition-transform duration-500 ease-in-out transform ${
          isEditorVisible ? 'scale-0' : 'scale-100'
        } bg-blue-500 text-white px-4 py-2 rounded-md`}
      >
        {isEditorVisible ? '' : 'Show Editor'}
      </button>
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isEditorVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isEditorVisible && <TweetEditor />}
      </div>
    </div>
  );
};

export default ToggleTweetEditor;