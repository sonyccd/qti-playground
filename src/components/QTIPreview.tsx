import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { QTIItemRenderer } from './qti/QTIItemRenderer';
import { parseQTIXML } from '@/utils/qtiParser';
import { QTIItem } from '@/types/qti';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle, CheckCircle, BookOpen, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QTIPreview() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [qtiItems, setQtiItems] = useState<QTIItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setErrors([]);
    setQtiItems([]);

    try {
      const text = await file.text();
      const parseResult = parseQTIXML(text);
      
      setQtiItems(parseResult.items);
      setErrors(parseResult.errors);
      
      if (parseResult.success) {
        toast({
          title: "QTI file loaded successfully",
          description: `Found ${parseResult.items.length} item(s)`,
        });
      } else {
        toast({
          title: "Warning",
          description: "Some items could not be parsed",
          variant: "destructive",
        });
      }
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
      const parseResult = parseQTIXML(xmlText);
      
      setQtiItems(parseResult.items);
      setErrors(parseResult.errors);
      
      // Create a mock file object for display
      const mockFile = new File([xmlText], 'sample-qti.xml', { type: 'text/xml' });
      setSelectedFile(mockFile);
      
      if (parseResult.success) {
        toast({
          title: "Example QTI file loaded",
          description: `Found ${parseResult.items.length} sample item(s)`,
        });
      }
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QTI Item Previewer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a QTI XML file to preview assessment items. Supports multiple-choice, 
            multiple-response, and fill-in-the-blank question types.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <FileUpload
            onFileSelect={handleFileSelect}
            onClear={handleClearFile}
            selectedFile={selectedFile}
          />
          
          {/* Example Button */}
          {!selectedFile && !isLoading && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadExample}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Try Example QTI File
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing QTI file...</p>
            </CardContent>
          </Card>
        )}

        {/* Errors */}
        {errors.length > 0 && !isLoading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary */}
        {qtiItems.length > 0 && !isLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold">
                  Found {qtiItems.length} assessment item{qtiItems.length !== 1 ? 's' : ''}
                </h3>
              </div>
              
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
            </CardContent>
          </Card>
        )}

        {/* Items Preview */}
        {qtiItems.length > 0 && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Item Preview</h2>
            </div>
            
            <Separator />
            
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
          </div>
        )}

        {/* Empty State */}
        {!selectedFile && !isLoading && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No QTI file selected</h3>
              <p className="text-muted-foreground mb-4">
                Upload a QTI XML file to start previewing assessment items, or try our example file to see how it works.
              </p>
              <Button
                variant="outline"
                onClick={handleLoadExample}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Try Example QTI File
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}