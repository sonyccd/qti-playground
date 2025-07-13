import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { QTIItemRenderer } from './qti/QTIItemRenderer';
import { parseQTIXML } from '@/utils/qtiParser';
import { QTIItem } from '@/types/qti';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle,
  Alert,
  Label,
  Button,
  Grid,
  GridItem,
  Title,
  PageSection,
  Flex,
  FlexItem,
  Badge
} from '@patternfly/react-core';
import { 
  FileIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  BookOpenIcon, 
  DownloadIcon, 
  CodeIcon, 
  EyeIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ColumnsIcon,
  HomeIcon
} from '@patternfly/react-icons';
import { useToast } from '@/hooks/use-toast';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { Link } from 'react-router-dom';

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

  return (
    <PageSection style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '112rem', margin: '0 auto' }}>
        {/* Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <Flex>
            <FlexItem>
              <Link to="/">
                <Button variant="link">
                  <HomeIcon style={{ marginRight: '0.5rem' }} />
                  Home
                </Button>
              </Link>
            </FlexItem>
            <FlexItem>
              <Link to="/learn">
                <Button variant="link">
                  <BookOpenIcon style={{ marginRight: '0.5rem' }} />
                  Learn
                </Button>
              </Link>
            </FlexItem>
          </Flex>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <BookOpenIcon style={{ fontSize: '32px', color: '#0066cc' }} />
            <Title headingLevel="h1" size="4xl">
              QTI Live Editor
            </Title>
          </div>
          <p style={{ fontSize: '1.125rem', maxWidth: '48rem', margin: '0 auto', color: '#6c757d' }}>
            Edit QTI XML content and see live preview updates. Upload a file or try the example to get started.
          </p>
        </div>

        {/* File Upload and Controls */}
        {!hasContent && (
          <div style={{ marginBottom: '1.5rem' }}>
            <FileUpload
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
              selectedFile={selectedFile}
            />
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Button
                variant="secondary"
                onClick={handleLoadExample}
                isDisabled={isLoading}
              >
                <DownloadIcon style={{ marginRight: '0.5rem' }} />
                Try Example QTI File
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardBody style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem', color: '#6c757d' }}>Processing QTI file...</div>
            </CardBody>
          </Card>
        )}

        {/* Side by Side Editor */}
        {hasContent && !isLoading && (
          <div>
            {/* Control Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Badge isRead>
                  {selectedFile?.name || 'sample-qti.xml'}
                </Badge>
                {qtiItems.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircleIcon style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button
                  variant={layoutMode === 'editor-only' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setLayoutMode('editor-only')}
                >
                  <ArrowLeftIcon />
                </Button>
                <Button
                  variant={layoutMode === 'split' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setLayoutMode('split')}
                >
                  <ColumnsIcon />
                </Button>
                <Button
                  variant={layoutMode === 'preview-only' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setLayoutMode('preview-only')}
                >
                  <ArrowRightIcon />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFile}
                >
                  <FileIcon style={{ marginRight: '0.5rem' }} />
                  New File
                </Button>
              </div>
            </div>

            {/* Editor Layout */}
            <Grid hasGutter style={{ minHeight: 'calc(100vh - 300px)' }}>
              {/* XML Editor */}
              {(layoutMode === 'editor-only' || layoutMode === 'split') && (
                <GridItem md={layoutMode === 'split' ? 6 : 12}>
                  <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardHeader>
                      <CardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CodeIcon />
                          QTI XML Editor
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardBody style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
                      <CodeMirror
                        value={xmlContent}
                        onChange={handleXmlChange}
                        extensions={[xml()]}
                        theme={oneDark}
                        style={{ height: '100%' }}
                        basicSetup={{
                          lineNumbers: true,
                          foldGutter: true,
                          dropCursor: false,
                          allowMultipleSelections: false,
                          indentOnInput: true,
                          autocompletion: true,
                        }}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              )}

              {/* Preview Panel */}
              {(layoutMode === 'preview-only' || layoutMode === 'split') && (
                <GridItem md={layoutMode === 'split' ? 6 : 12}>
                  <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardHeader>
                      <CardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <EyeIcon />
                          Live Preview
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardBody style={{ flex: 1, overflow: 'auto' }}>
                      {/* Errors */}
                      {errors.length > 0 && (
                        <Alert variant="danger" title="Parse Errors" style={{ marginBottom: '1rem' }}>
                          <div>
                            {errors.map((error, index) => (
                              <div key={index} style={{ fontSize: '0.875rem' }}>{error}</div>
                            ))}
                          </div>
                        </Alert>
                      )}

                      {/* Item Type Summary */}
                      {qtiItems.length > 0 && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Parsed Items</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
                              const count = qtiItems.filter(item => item.type === type).length;
                              return (
                                <Badge key={type} isRead>
                                  {count} {getItemTypeLabel(type)}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      {qtiItems.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {qtiItems.map((item, index) => (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Badge isRead>
                                  #{index + 1}
                                </Badge>
                                <Badge isRead>
                                  {getItemTypeLabel(item.type)}
                                </Badge>
                              </div>
                              <QTIItemRenderer item={item} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        !errors.length && (
                          <div style={{ textAlign: 'center', color: '#6c757d', padding: '3rem 0' }}>
                            <FileIcon style={{ fontSize: '48px', opacity: 0.5, marginBottom: '0.75rem' }} />
                            <p>No valid QTI items found</p>
                            <p style={{ fontSize: '0.875rem' }}>Check your XML structure</p>
                          </div>
                        )
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              )}
            </Grid>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && !isLoading && (
          <Card style={{ border: '2px dashed #d1d5db' }}>
            <CardBody style={{ padding: '3rem', textAlign: 'center' }}>
              <CodeIcon style={{ fontSize: '64px', color: '#6c757d', marginBottom: '1rem' }} />
              <Title headingLevel="h3" size="xl" style={{ marginBottom: '0.5rem' }}>QTI Live Editor</Title>
              <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                Upload a QTI XML file to start editing, or try our example file to see the live editor in action.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </PageSection>
  );
}