import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function TextEditor({
  value = '',
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}): React.JSX.Element {
  const handleChange = (content: string): void => {
    onChange(content);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      placeholder="Введите текст здесь..."
      className="text-editor"
    />
  );
}
