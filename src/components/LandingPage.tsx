import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, FileText, Code, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            QTI Playground
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore, create, and test QTI (Question & Test Interoperability) content with our interactive playground
          </p>
        </div>

        {/* Main CTAs */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Start Playing</CardTitle>
              <CardDescription className="text-base">
                Jump right into the playground and start experimenting with QTI content
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/playground">
                <Button size="lg" className="w-full">
                  Go to Playground
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Learn QTI</CardTitle>
              <CardDescription className="text-base">
                New to QTI? Learn the basics and discover what's possible
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/learn">
                <Button variant="outline" size="lg" className="w-full">
                  Start Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Editor</h3>
            <p className="text-muted-foreground">
              Write and edit QTI XML with syntax highlighting and real-time preview
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Preview</h3>
            <p className="text-muted-foreground">
              See how your QTI content will render and behave in real-time
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Examples & Samples</h3>
            <p className="text-muted-foreground">
              Start with built-in examples or upload your own QTI files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;