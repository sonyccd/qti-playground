import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Play, Code2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn QTI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Question & Test Interoperability (QTI) is a standard for creating portable, interoperable assessment content
          </p>
        </div>

        {/* What is QTI */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              What is QTI?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              QTI (Question & Test Interoperability) is an international standard that defines how assessment content 
              should be structured and exchanged between different learning management systems and assessment platforms.
            </p>
            <p>
              With QTI, you can create questions and assessments that work across different platforms without 
              modification, ensuring your educational content is truly portable and interoperable.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Question Types</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Multiple Choice</li>
                  <li>• Fill-in-the-blank</li>
                  <li>• True/False</li>
                  <li>• Essay Questions</li>
                  <li>• Matching</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advanced Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Response Processing</li>
                  <li>• Scoring Rules</li>
                  <li>• Adaptive Testing</li>
                  <li>• Media Integration</li>
                  <li>• Accessibility Support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Ready to create your first QTI content? Here's how to get started:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Start with the Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    Head to the playground to experiment with QTI content in a live editor
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Try the Sample Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Load the example QTI file to see how different question types are structured
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Modify and Experiment</h4>
                  <p className="text-sm text-muted-foreground">
                    Edit the XML content and see how your changes affect the rendered output
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">
            Jump into the playground and start creating your first QTI content
          </p>
          <Link to="/playground">
            <Button size="lg" className="mr-4">
              <Play className="w-4 h-4 mr-2" />
              Go to Playground
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Learn;