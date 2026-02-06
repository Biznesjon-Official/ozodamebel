import React from 'react';
import styled from 'styled-components';

const Highlight = styled.span`
  background-color: #fde047;
  color: #1f2937;
  font-weight: inherit;
  border-radius: 2px;
  padding: 0;
`;

const HighlightedText = ({ text = '', highlight = '' }) => {
    if (!text) return null;
    // Ensure text is a string
    const validText = String(text);

    if (!highlight || !highlight.trim()) {
        return <span>{validText}</span>;
    }

    try {
        // Escape special regex characters in highlight string
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
        const parts = validText.split(regex);

        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? <Highlight key={i}>{part}</Highlight> : part
                )}
            </span>
        );
    } catch (e) {
        console.error('Highlighting error', e);
        return <span>{validText}</span>;
    }
};

export default HighlightedText;
