import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from './FileUpload';
import { QTIItemRenderer } from './qti/QTIItemRenderer';
import { parseQTIXML } from '@/utils/qtiParser';
import { QTIItem } from '@/types/qti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { 
  ArrowLeft, 
  Book, 
  Code, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Columns2,
  FileCode,
  Monitor
} from 'lucide-react';

type LayoutMode = 'split' | 'editor-only' | 'preview-only';

export function QTIPreview() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [qtiItems, setQtiItems] = useState<QTIItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [hasContent, setHasContent] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [unsupportedElements, setUnsupportedElements] = useState<import('@/types/qti').UnsupportedElement[]>([]);
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
      setUnsupportedElements(parseResult.unsupportedElements);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'XML Parse Error';
      setErrors([errorMessage]);
      setQtiItems([]);
      setUnsupportedElements([]);
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
    setUnsupportedElements([]);
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

  const navigationItems = [
    { title: "File Upload", icon: FileText, active: !hasContent },
    { title: "XML Editor", icon: Code, active: hasContent && (layoutMode === 'editor-only' || layoutMode === 'split') },
    { title: "Live Preview", icon: Eye, active: hasContent && (layoutMode === 'preview-only' || layoutMode === 'split') },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r">
          <SidebarContent>
            <div className="p-4 border-b">
              <Button variant="ghost" size="sm" asChild className="w-full justify-start mb-2">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                <Link to="/learn">
                  <Book className="mr-2 h-4 w-4" />
                  Learn QTI
                </Link>
              </Button>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                QTI Playground
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className={item.active ? "bg-accent text-accent-foreground" : ""}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {hasContent && (
              <SidebarGroup>
                <SidebarGroupLabel>Layout Options</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => setLayoutMode('editor-only')}
                        className={layoutMode === 'editor-only' ? "bg-accent text-accent-foreground" : ""}
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        Editor Only
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => setLayoutMode('split')}
                        className={layoutMode === 'split' ? "bg-accent text-accent-foreground" : ""}
                      >
                        <Columns2 className="mr-2 h-4 w-4" />
                        Split View
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => setLayoutMode('preview-only')}
                        className={layoutMode === 'preview-only' ? "bg-accent text-accent-foreground" : ""}
                      >
                        <Monitor className="mr-2 h-4 w-4" />
                        Preview Only
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">QTI Playground</h1>
              </div>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            {/* File Upload Section */}
            {!hasContent && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">QTI Live Editor</h2>
                  <p className="text-muted-foreground text-lg">
                    Edit QTI XML content and see live preview updates. Upload a file or try the example to get started.
                  </p>
                </div>

                <FileUpload
                  onFileSelect={handleFileSelect}
                  onClear={handleClearFile}
                  selectedFile={selectedFile}
                />
                
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={handleLoadExample}
                    disabled={isLoading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Try Example QTI File
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Processing QTI file...</p>
                </CardContent>
              </Card>
            )}

            {/* Editor Layout */}
            {hasContent && !isLoading && (
              <div className="h-full flex flex-col">
                {/* Control Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedFile?.name || 'sample-qti.xml'}
                    </Badge>
                    {qtiItems.length > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFile}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    New File
                  </Button>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex gap-4 min-h-0">
                  {/* XML Editor */}
                  {(layoutMode === 'editor-only' || layoutMode === 'split') && (
                    <div className={`${layoutMode === 'split' ? 'flex-1' : 'w-full'} flex flex-col min-w-0`}>
                      <Card className="flex-1 flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Code className="h-5 w-5" />
                            QTI XML Editor
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                          <CodeMirror
                            value={xmlContent}
                            onChange={handleXmlChange}
                            extensions={[xml()]}
                            theme={oneDark}
                            height="100%"
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
                    </div>
                  )}

                  {/* Preview Panel */}
                  {(layoutMode === 'preview-only' || layoutMode === 'split') && (
                    <div className={`${layoutMode === 'split' ? 'flex-1' : 'w-full'} flex flex-col min-w-0`}>
                      <Card className="flex-1 flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Eye className="h-5 w-5" />
                            Live Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                          {/* Errors */}
                          {errors.length > 0 && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="font-medium mb-1">Parsing Errors</div>
                                {errors.map((error, index) => (
                                  <div key={index} className="text-sm">
                                    {error}
                                  </div>
                                ))}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Item Type Summary */}
                          {qtiItems.length > 0 && (
                            <div className="mb-4 p-3 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Parsed Items</h4>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
                                  const count = qtiItems.filter(item => item.type === type).length;
                                  return (
                                    <Badge key={type} variant="secondary">
                                      {count} {getItemTypeLabel(type)}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Unsupported Elements Summary */}
                          {unsupportedElements.length > 0 && (
                            <Alert className="mb-4">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="font-medium mb-2">Unsupported Elements Found</div>
                                <div className="space-y-1">
                                  {unsupportedElements.map((element, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <span>{element.description}</span>
                                      <Badge variant="outline">{element.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  These elements were found but are not currently supported by the previewer.
                                </p>
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Items */}
                          {qtiItems.length > 0 ? (
                            <div className="space-y-6">
                              {qtiItems.map((item, index) => (
                                <div key={item.id}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="outline">#{index + 1}</Badge>
                                    <Badge>{getItemTypeLabel(item.type)}</Badge>
                                  </div>
                                  <QTIItemRenderer item={item} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            !errors.length && (
                              <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                  No valid QTI items found
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Check your XML structure
                                </p>
                              </div>
                            )
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasContent && !isLoading && (
              <Card className="max-w-2xl mx-auto border-dashed border-2">
                <CardContent className="text-center py-12">
                  <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">QTI Live Editor</h3>
                  <p className="text-muted-foreground">
                    Upload a QTI XML file to start editing, or try our example file to see the live editor in action.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}