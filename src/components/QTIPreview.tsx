import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { QTIItemRenderer } from './qti/QTIItemRenderer';
import { parseQTIXML } from '@/utils/qtiParser';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle, CheckCircle, BookOpen, Download, Code, Eye, PanelLeft, PanelRight, Columns } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';

type LayoutMode = 'split' | 'editor-only' | 'preview-only';

export function QTIPreview() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [qtiItems, setQtiItems] = useState<QTIItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [hasContent, setHasContent] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setErrors([]);
    setQtiItems([]);

    try {
      const text = await file.text();
      setXmlContent(text);
      setHasContent(true);
      parseXMLContent(text);
      
      toast({
        title: "QTI file loaded",
        description: "File content loaded in editor",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([`Failed to read file: ${errorMessage}`]);
      toast({
        title: "Error",
        description: "Failed to process the QTI file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseXMLContent = (xmlText: string) => {
    try {
      const parseResult = parseQTIXML(xmlText);
      setQtiItems(parseResult.items);
      setErrors(parseResult.errors);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'XML Parse Error';
      setErrors([errorMessage]);
      setQtiItems([]);
    }
  };

  const handleXmlChange = (value: string) => {
    setXmlContent(value);
    parseXMLContent(value);
  };

  const handleLoadExample = async () => {
    setIsLoading(true);
    setErrors([]);
    setQtiItems([]);
    setSelectedFile(undefined);

    try {
      const response = await fetch('/sample-qti.xml');
      if (!response.ok) {
        throw new Error('Failed to load example file');
      }
      
      const xmlText = await response.text();
      setXmlContent(xmlText);
      setHasContent(true);
      parseXMLContent(xmlText);
      
      // Create a mock file object for display
      const mockFile = new File([xmlText], 'sample-qti.xml', { type: 'text/xml' });
      setSelectedFile(mockFile);
      
      toast({
        title: "Example QTI file loaded",
        description: "Content loaded in editor",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([`Failed to load example file: ${errorMessage}`]);
      toast({
        title: "Error",
        description: "Failed to load the example QTI file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(undefined);
    setQtiItems([]);
    setErrors([]);
    setXmlContent('');
    setHasContent(false);
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'choice':
        return 'Multiple Choice';
      case 'multipleResponse':
        return 'Multiple Response';
      case 'textEntry':
        return 'Fill in the Blank';
      default:
        return 'Unknown';
    }
  };

  const getItemTypeVariant = (type: string) => {
    switch (type) {
      case 'choice':
        return 'default';
      case 'multipleResponse':
        return 'secondary';
      case 'textEntry':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QTI Live Editor
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Edit QTI XML content and see live preview updates. Upload a file or try the example to get started.
          </p>
        </div>

        {/* File Upload and Controls */}
        {!hasContent && (
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
              selectedFile={selectedFile}
            />
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadExample}
                className="gap-2"
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
                Try Example QTI File
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing QTI file...</p>
            </CardContent>
          </Card>
        )}

        {/* Side by Side Editor */}
        {hasContent && !isLoading && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {selectedFile?.name || 'sample-qti.xml'}
                </Badge>
                {qtiItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Layout Controls */}
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={layoutMode === 'editor-only' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('editor-only')}
                    className="h-8 px-3"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layoutMode === 'split' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('split')}
                    className="h-8 px-3"
                  >
                    <Columns className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layoutMode === 'preview-only' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('preview-only')}
                    className="h-8 px-3"
                  >
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFile}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  New File
                </Button>
              </div>
            </div>

            {/* Editor Layout */}
            <div className={`grid gap-6 h-[calc(100vh-300px)] ${
              layoutMode === 'editor-only' ? 'grid-cols-1' :
              layoutMode === 'preview-only' ? 'grid-cols-1' :
              'grid-cols-1 lg:grid-cols-2'
            }`}>
              {/* XML Editor */}
              {(layoutMode === 'editor-only' || layoutMode === 'split') && (
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Code className="h-4 w-4" />
                      QTI XML Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <CodeMirror
                      value={xmlContent}
                      onChange={handleXmlChange}
                      extensions={[xml()]}
                      theme={oneDark}
                      className="h-full"
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: true,
                        autocompletion: true,
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Preview Panel */}
              {(layoutMode === 'preview-only' || layoutMode === 'split') && (
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {/* Errors */}
                    {errors.length > 0 && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {errors.map((error, index) => (
                              <div key={index} className="text-sm">{error}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Item Type Summary */}
                    {qtiItems.length > 0 && (
                      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
                            const count = qtiItems.filter(item => item.type === type).length;
                            return (
                              <Badge 
                                key={type} 
                                variant={getItemTypeVariant(type) as any}
                                className="text-xs"
                              >
                                {count} {getItemTypeLabel(type)}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    {qtiItems.length > 0 ? (
                      <div className="space-y-6">
                        {qtiItems.map((item, index) => (
                          <div key={item.id} className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs font-mono">
                                #{index + 1}
                              </Badge>
                              <Badge variant={getItemTypeVariant(item.type) as any} className="text-xs">
                                {getItemTypeLabel(item.type)}
                              </Badge>
                            </div>
                            <QTIItemRenderer item={item} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      !errors.length && (
                        <div className="text-center text-muted-foreground py-12">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No valid QTI items found</p>
                          <p className="text-sm">Check your XML structure</p>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && !isLoading && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">QTI Live Editor</h3>
              <p className="text-muted-foreground mb-4">
                Upload a QTI XML file to start editing, or try our example file to see the live editor in action.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}