import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/icons';

interface ResponseBoxProps {
    children: React.ReactNode;
    rawContent?: string;
    onSave?: (event: { value: string }) => void;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ children, rawContent, onSave }) => {
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



    return (
        <div
            className="flex justify-end"
            onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
        >
        <div className="w-full">
            <div className="w-full flex justify-end">
                <div className="w-fit text-dark">
                    {textValue || children}
                </div>
                </div>
                <div className="w-full flex justify-start">
                    <div className={`flex gap-2 ${showButtons ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                        <button onClick={handleCopy} className="text-gray-400 hover:text-blue-500 p-2 px-0">
                            {isCopied ? <Icons.check /> : <Icons.copy />} {/* Toggle between Check and Copy */}
                        </button>
                        <button onClick={handleEdit} className="text-gray-400 hover:text-blue-500 p-2 px-0">
                            <Icons.edit />
                        </button>
                        <button onClick={() =>{}} className="text-gray-400 hover:text-blue-500 p-2 px-0">
                            <Icons.share />
                        </button>
                        <button onClick={() =>{}} className="text-gray-400 hover:text-blue-500 p-2 px-0">
                            <Icons.like />
                        </button>
                        <button onClick={() =>{}} className="text-gray-400 hover:text-blue-500 p-2 px-0">
                            <Icons.disLike />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseBox;