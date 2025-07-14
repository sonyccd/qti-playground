import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { QTIItemRenderer } from './qti/QTIItemRenderer';
import { AddItemButton } from './qti/AddItemButton';
import { parseQTIXML } from '@/utils/qtiParser';
import { insertItemIntoXML } from '@/utils/qtiTemplates';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, Typography, Box, Container, Button, Chip, Alert, AlertTitle, Avatar, ToggleButton, ToggleButtonGroup, useTheme, CircularProgress, Grid } from '@mui/material';
import { Description, Warning, CheckCircle, MenuBook, Download, Code, Visibility, ViewColumn, ViewAgenda, ViewStream, Home, School, OpenInFull, Add } from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
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
  const [newlyAddedItemId, setNewlyAddedItemId] = useState<string | null>(null);
  
  const {
    toast
  } = useToast();
  const theme = useTheme();
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
        description: "File content loaded in editor"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([`Failed to read file: ${errorMessage}`]);
      toast({
        title: "Error",
        description: "Failed to process the QTI file",
        variant: "destructive"
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
      // Store unsupported elements for display
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

      // Create a mock file object for display
      const mockFile = new File([xmlText], 'sample-qti.xml', {
        type: 'text/xml'
      });
      setSelectedFile(mockFile);
      toast({
        title: "Example QTI file loaded",
        description: "Content loaded in editor"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([`Failed to load example file: ${errorMessage}`]);
      toast({
        title: "Error",
        description: "Failed to load the example QTI file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlankFile = () => {
    const blankQTITemplate = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                identifier="sample-item" 
                title="New QTI Item" 
                adaptive="false" 
                timeDependent="false">
  
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>ChoiceA</value>
    </correctResponse>
  </responseDeclaration>
  
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
    <defaultValue>
      <value>0</value>
    </defaultValue>
  </outcomeDeclaration>
  
  <itemBody>
    <div>
      <p>Enter your question text here.</p>
      <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
        <prompt>Select the correct answer:</prompt>
        <simpleChoice identifier="ChoiceA">Option A</simpleChoice>
        <simpleChoice identifier="ChoiceB">Option B</simpleChoice>
        <simpleChoice identifier="ChoiceC">Option C</simpleChoice>
        <simpleChoice identifier="ChoiceD">Option D</simpleChoice>
      </choiceInteraction>
    </div>
  </itemBody>
  
  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
  
</assessmentItem>`;

    setXmlContent(blankQTITemplate);
    setHasContent(true);
    setSelectedFile(undefined);
    parseXMLContent(blankQTITemplate);
    
    toast({
      title: "Blank QTI file created",
      description: "A new blank QTI template is ready for editing"
    });
  };
  const handleClearFile = () => {
    setSelectedFile(undefined);
    setQtiItems([]);
    setErrors([]);
    setXmlContent('');
    setHasContent(false);
    setUnsupportedElements([]);
  };

  const handleAddItem = (itemXML: string, insertAfterIndex?: number) => {
    try {
      const prevItemCount = qtiItems.length;
      const updatedXML = insertItemIntoXML(xmlContent, itemXML, insertAfterIndex);
      
      setXmlContent(updatedXML);
      parseXMLContent(updatedXML);
      
      // Set the ID of the newly added item for animation
      const newItemIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
        ? insertAfterIndex + 1 
        : insertAfterIndex === -1 
          ? 0  // Adding to the top
          : prevItemCount; // Adding to the end
      
      // Clear the animation state after a short delay to trigger the animation
      setTimeout(() => {
        const parseResult = parseQTIXML(updatedXML);
        if (parseResult.items[newItemIndex]) {
          setNewlyAddedItemId(parseResult.items[newItemIndex].id);
          
          // Clear the animation state after animation completes
          setTimeout(() => {
            setNewlyAddedItemId(null);
          }, 600);
        }
      }, 100);
      
      toast({
        title: "Item added",
        description: "New QTI item has been added successfully"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: `Failed to add item: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'choice':
        return 'Multiple Choice';
      case 'multipleResponse':
        return 'Multiple Response';
      case 'textEntry':
        return 'Fill in the Blank';
      case 'extendedText':
        return 'Extended Text';
      case 'hottext':
        return 'Hottext Selection';
      case 'slider':
        return 'Slider';
      case 'order':
        return 'Order Interaction';
      default:
        return 'Unknown';
    }
  };
  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'choice':
        return 'primary';
      case 'multipleResponse':
        return 'secondary';
      case 'textEntry':
        return 'success';
      case 'extendedText':
        return 'info';
      case 'hottext':
        return 'warning';
      case 'slider':
        return 'default';
      case 'order':
        return 'destructive';
      default:
        return 'error';
    }
  };
  return <Box sx={{
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
    py: 3,
    px: 2
  }}>
      <Container maxWidth="xl">
        

        {/* File Upload and Controls */}
        {!hasContent && <Box sx={{
        mb: 4
      }}>
            <FileUpload onFileSelect={handleFileSelect} onClear={handleClearFile} selectedFile={selectedFile} />
            
            <Box textAlign="center" sx={{
          mt: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'center'
        }}>
              <Button variant="outlined" onClick={handleLoadExample} startIcon={<Download />} disabled={isLoading}>
                Try Example QTI File
              </Button>
              <Button variant="outlined" onClick={handleCreateBlankFile} startIcon={<Add />} disabled={isLoading}>
                Create Blank File
              </Button>
            </Box>
          </Box>}

        {/* Loading State */}
        {isLoading && <Card sx={{
        mb: 4
      }}>
            <CardContent sx={{
          textAlign: 'center',
          py: 8
        }}>
              <CircularProgress size={40} sx={{
            mb: 2
          }} />
              <Typography color="text.secondary">Processing QTI file...</Typography>
            </CardContent>
          </Card>}

        {/* Side by Side Editor */}
        {hasContent && !isLoading && <Box sx={{
        mb: 4
      }}>
            {/* Control Bar */}
            <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}>
              <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
                <Chip label={selectedFile?.name || 'sample-qti.xml'} variant="outlined" size="small" />
                {qtiItems.length > 0 && <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
                    </Typography>
                  </Box>}
              </Box>
              
              <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => {
                    const blob = new Blob([xmlContent], { type: 'application/xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'qti-item.xml';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  startIcon={<Download />}
                  disabled={!xmlContent.trim()}
                >
                  Download XML
                </Button>
                <Button variant="outlined" size="small" onClick={handleClearFile} startIcon={<Description />}>
                  New File
                </Button>
              </Box>
            </Box>

            {/* Editor Layout */}
            <Box sx={{
          display: 'flex',
          gap: 2,
          height: 'calc(100vh - 200px)'
        }}>
              {/* XML Editor */}
              {(layoutMode === 'editor-only' || layoutMode === 'split') && <Box sx={{
            flex: layoutMode === 'split' ? 1 : 1,
            minWidth: 0
          }}>
                  <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
                    <CardContent sx={{
                pb: 1
              }}>
                      <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                        <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                          <Code fontSize="small" />
                          <Typography variant="h6" component="h3">
                            QTI XML Editor
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant={layoutMode === 'editor-only' ? 'contained' : 'outlined'}
                          onClick={() => setLayoutMode(layoutMode === 'editor-only' ? 'split' : 'editor-only')}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          <OpenInFull fontSize="small" />
                        </Button>
                      </Box>
                    </CardContent>
                    <Box sx={{
                flex: 1,
                overflow: 'auto',
                height: 0
              }}>
                      <CodeMirror 
                        value={xmlContent} 
                        onChange={handleXmlChange} 
                        extensions={[xml(), EditorView.lineWrapping]} 
                        theme={oneDark} 
                        style={{
                          height: '100%'
                        }} 
                        basicSetup={{
                          lineNumbers: true,
                          foldGutter: true,
                          dropCursor: false,
                          allowMultipleSelections: false,
                          indentOnInput: true,
                          autocompletion: true
                        }}
                      />
                    </Box>
                  </Card>
                </Box>}

              {/* Preview Panel */}
              {(layoutMode === 'preview-only' || layoutMode === 'split') && <Box sx={{
            flex: layoutMode === 'split' ? 1 : 1,
            minWidth: 0
          }}>
                  <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
                    <CardContent sx={{
                pb: 1
              }}>
                      <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                        <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                          <Visibility fontSize="small" />
                          <Typography variant="h6" component="h3">
                            Live Preview
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant={layoutMode === 'preview-only' ? 'contained' : 'outlined'}
                          onClick={() => setLayoutMode(layoutMode === 'preview-only' ? 'split' : 'preview-only')}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          <OpenInFull fontSize="small" />
                        </Button>
                      </Box>
                    </CardContent>
                    <CardContent sx={{
                flex: 1,
                overflow: 'auto',
                pt: 0
              }}>
                      {/* Errors */}
                      {errors.length > 0 && <Alert severity="error" sx={{
                  mb: 2
                }}>
                          <AlertTitle>Parsing Errors</AlertTitle>
                          {errors.map((error, index) => <Typography key={index} variant="body2">
                              {error}
                            </Typography>)}
                        </Alert>}

                      {/* Item Type Summary */}
                      {qtiItems.length > 0 && <Box sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1
                }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Parsed Items
                          </Typography>
                          <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                            {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
                      const count = qtiItems.filter(item => item.type === type).length;
                      return <Chip key={type} label={`${count} ${getItemTypeLabel(type)}`} color={getItemTypeColor(type) as any} size="small" />;
                    })}
                          </Box>
                        </Box>}

                      {/* Unsupported Elements Summary */}
                      {unsupportedElements.length > 0 && <Alert severity="warning" sx={{
                  mb: 3
                }}>
                          <AlertTitle>Unsupported Elements Found</AlertTitle>
                          <Box sx={{
                    mt: 1
                  }}>
                            {unsupportedElements.map((element, index) => <Box key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                                <Typography variant="body2">
                                  {element.description}
                                </Typography>
                                <Chip label={element.count} size="small" variant="outlined" />
                              </Box>)}
                          </Box>
                          <Typography variant="caption" sx={{
                    mt: 1,
                    display: 'block'
                  }}>
                            These elements were found but are not currently supported by the previewer.
                          </Typography>
                        </Alert>}

                       {/* Items */}
                       {qtiItems.length > 0 ? <Box sx={{
                   display: 'flex',
                   flexDirection: 'column'
                 }}>
                            {/* Add item button at the beginning */}
                            <AddItemButton onAddItem={(itemXML) => handleAddItem(itemXML, -1)} />
                            
                            {qtiItems.map((item, index) => (
                              <Box key={item.id} sx={{ mb: 2 }}>
                                <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}>
                                  <Chip label={`#${index + 1}`} variant="outlined" size="small" />
                                  <Chip label={getItemTypeLabel(item.type)} color={getItemTypeColor(item.type) as any} size="small" />
                                </Box>
                                <QTIItemRenderer item={item} isNewlyAdded={item.id === newlyAddedItemId} />
                                
                                {/* Add item button after each item */}
                                <AddItemButton onAddItem={(itemXML) => handleAddItem(itemXML, index)} />
                              </Box>
                            ))}
                         </Box> : !errors.length && <Box sx={{
                   textAlign: 'center',
                   py: 6
                 }}>
                             <Description sx={{
                     fontSize: 48,
                     color: 'text.disabled',
                     mb: 1
                   }} />
                             <Typography variant="h6" color="text.secondary">
                               No valid QTI items found
                             </Typography>
                             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                               Check your XML structure or add a new item below
                             </Typography>
                             {/* Add item button when no items exist */}
                             <AddItemButton onAddItem={(itemXML) => handleAddItem(itemXML)} />
                           </Box>}
                    </CardContent>
                  </Card>
                </Box>}
            </Box>
          </Box>}

      </Container>
    </Box>;
}