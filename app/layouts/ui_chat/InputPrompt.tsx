import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Icons } from '../../components/icons';

interface InputPromptProps {
    value?: string;
    onChange?: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    children?: ReactNode;
    disabled?: boolean; // Added for accessibility
    ariaLabel?: string; // Added for accessibility
}

const InputPrompt: React.FC<InputPromptProps> = ({
    value = '',
    onChange = () => {},
    placeholder = '',
    children,
    disabled = false,
    ariaLabel = 'Input prompt',
    onKeyDown = () => {},
    ...rest // Capture all other textarea attributes
}) => {
    const [textValue, setTextValue] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const maxHeight = 150; // Matches maxHeight: '150px' in textarea style

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    useEffect(() => {
        autoResize();
    }, [textValue]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setTextValue(newValue);
        onChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown(e);
    };

    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    };

    return (
        <div
            className="w-full flex justify-end bg-[var(--background-alt)]"
            style={{
                borderRadius: '6px',
                padding: '10px',
            }}
        >
            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    className="w-full bg-[var(--background)] focus:outline-none rounded-md p-2 resize-none"
                    style={{ maxHeight: '150px', overflow: 'auto' }}
                    value={textValue}
                    onChange={handleTextChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...rest} // Spread all additional textarea attributes
                />
                <div className='flex justify-between'>
                    <div className='flex justify-between gap-2'>
                        <button 
                            className="p-1 hover:bg-pink-400 rounded"
                            disabled={disabled}
                            aria-label="Add content"
                            onClick={()=>{}}
                        >
                            <Icons.plus/>
                        </button>
                        {/* <button 
                            className="p-1 hover:bg-pink-400 rounded"
                            disabled={disabled}
                            aria-label="Add content"
                            onClick={()=>{}}
                        >
                            Quiz
                        </button>
                        <button 
                            className="p-1 hover:bg-pink-400 rounded"
                            disabled={disabled}
                            aria-label="Add content"
                            onClick={()=>{}}
                        >
                            Lesson plan
                        </button> */}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default InputPrompt;