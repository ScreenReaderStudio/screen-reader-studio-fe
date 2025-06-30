'use client';

import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';

import { useCodeStore } from '@/stores/useCodeStore';

export default function CodeEditor() {
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);

  const onChange = (value: string) => {
    setCode(value);
  };

  return (
    <div className="rounded-md border border-gray-300 p-1.5 shadow-md">
      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]}
        onChange={onChange}
        theme="light"
      />
    </div>
  );
}
