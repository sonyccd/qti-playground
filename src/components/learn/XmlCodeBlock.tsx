import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';

interface XmlCodeBlockProps {
  code: string;
  className?: string;
}

export const XmlCodeBlock = ({ code, className = "mb-6" }: XmlCodeBlockProps) => {
  return (
    <div className={`${className} w-full overflow-x-auto`}>
      <CodeMirror
        value={code}
        extensions={[xml()]}
        theme={oneDark}
        editable={false}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          autocompletion: false,
          searchKeymap: false,
          highlightSelectionMatches: false
        }}
        style={{
          fontSize: '14px',
          backgroundColor: 'transparent',
          minWidth: 'fit-content'
        }}
      />
    </div>
  );
};