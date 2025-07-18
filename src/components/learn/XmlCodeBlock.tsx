import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { ContentFormat } from '@/types/contentFormat';

interface XmlCodeBlockProps {
  code: string;
  className?: string;
  format?: ContentFormat;
}

export const XmlCodeBlock = ({ code, className = "mb-6", format = 'xml' }: XmlCodeBlockProps) => {
  const languageExtension = format === 'json' ? json() : xml();
  
  return (
    <div className={`${className} w-full overflow-x-auto`}>
      <div className="min-w-0">
        <CodeMirror
          value={code}
          extensions={[
            languageExtension,
            EditorView.lineWrapping
          ]}
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
            fontSize: '12px',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
};