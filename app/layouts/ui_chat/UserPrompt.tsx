import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/icons';

interface UserPromptProps {
  children: React.ReactNode;
  rawContent?: string;
  onSave?: (event: { value: string }) => void;
}

const UserPrompt: React.FC<UserPromptProps> = ({ children, rawContent, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [textValue, setTextValue] = useState(rawContent || '');
  const [isCopied, setIsCopied] = useState(false); // New state for copy feedback

  const textContent = rawContent || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setIsCopied(true); // Show Check icon
    // alert('Text copied to clipboard!');
  };

  // Reset isCopied after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // 2 seconds delay
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [isCopied]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTextValue(rawContent || '');
  };

  const handleSave = () => {
    if (!textValue.trim()) {
      alert('Text cannot be empty!');
      return;
    }
    setIsEditing(false);
    if (onSave) {
      onSave({ value: textValue });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const renderView = () => (
    <div
      className="flex justify-end"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <div className="w-full">
        <div className="w-full flex justify-end">
          <div
            className="bg-[var(--background-alt)] w-fit"
            style={{
              borderRadius: '6px',
              padding: '10px',
            }}
          >
            {textValue || children}
          </div>
        </div>
        <div className="w-full flex justify-end gap-2">
          <div className={`${showButtons ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            <button onClick={handleCopy} className="text-gray-400 hover:text-blue-500 p-1">
              {isCopied ? <Icons.check /> : <Icons.copy />} {/* Toggle between Check and Copy */}
            </button>
            <button onClick={handleEdit} className="text-gray-400 hover:text-blue-500 p-1">
              <Icons.edit />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEdit = () => (
    <div
      className="w-[80%] flex justify-end bg-[var(--background-alt)]"
      style={{
        borderRadius: '6px',
        padding: '10px',
      }}
    >
      <div className="w-full">
        <textarea
          className="w-full text-dark focus:outline-none bg-[var(--background)] rounded-md p-2 resize-y"
          rows={4}
          value={textValue}
          onChange={handleTextChange}
        />
        <div className="w-full flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-pink-600 hover:bg-pink-400 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return isEditing ? renderEdit() : renderView();
};

export default UserPrompt;