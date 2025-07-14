import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface XmlCodeBlockProps {
  code: string;
  className?: string;
}

export const XmlCodeBlock = ({ code, className = "mb-6" }: XmlCodeBlockProps) => {
  return (
    <div className={`${className} w-full overflow-x-auto`}>
      <div className="min-w-0">
        <CodeMirror
          value={code}
          extensions={[
            xml(),
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