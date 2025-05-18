import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Import rehype-raw
import { v4 as uuidv4 } from 'uuid';
import styles from '@/KamblokMarkdown.module.css';

// Define props interface for TypeScript
interface KamblokMarkdownProps {
  children: string;
}

// Define props for the code component
interface CodeProps {
  node?: object;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const KamblokMarkdown: React.FC<KamblokMarkdownProps> = ({ children }) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  let buttonStyleIndex = 0;

  const handleCopy = useCallback((content: string, buttonId: string) => {
    if (!content) return;

    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedStates(prev => ({ ...prev, [buttonId]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [buttonId]: false }));
        }, 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  }, []);

  return (
    <div className={styles.messageContent}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Add rehype-raw to process raw HTML
        components={{
          code: ({ inline, className = '', children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className);
            const language = match ? match[1] : 'text';

            // Treat inline code or language 'text' as inline
            if (inline || language === 'text') {
              return (
                <code className={`${className} ${styles.inlineCode}`} {...props}>
                  {children}
                </code>
              );
            }

            const content = children 
              ? (Array.isArray(children) 
                  ? children.join('').trim() 
                  : String(children).trim()) 
              : '';
            const buttonId = uuidv4();
            const styleClass = (buttonStyleIndex++ % 2 === 0) 
              ? styles.copyButtonStyle1 
              : styles.copyButtonStyle2;

            return (
              <div className={styles.codeWrapper}>
                <div className={styles.codeHeader}>
                  <span className={styles.language}>{language}</span>
                  <button 
                    className={`${styles.copyButton} ${styleClass}`} 
                    onClick={() => handleCopy(content, buttonId)}
                    disabled={!content}
                    title={copiedStates[buttonId] ? 'Copied!' : 'Copy code'}
                    aria-label={copiedStates[buttonId] ? 'Code copied' : 'Copy code'}
                  >
                    {copiedStates[buttonId] ? (
                      <span className={styles.copiedState}>
                        <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied
                      </span>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
                <pre className={styles.codeBlock}>
                  <code className={`${className} ${styles.codeElement}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default KamblokMarkdown;