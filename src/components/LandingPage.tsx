import { Button } from "@/components/ui/button";
import { BookOpen, Play, FileText, Code, Lightbulb, ArrowRight, Github, Book, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 pb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
              QTI Playground
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              The interactive environment for exploring, creating, and testing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                Question & Test Interoperability
              </span>{" "}
              content
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/playground">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/learn">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-6 text-lg"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Learn QTI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything you need for QTI development
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A comprehensive toolkit for working with QTI assessments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Live XML Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Write and edit QTI XML with syntax highlighting, auto-completion, and real-time validation
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Instant Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                See your QTI content render in real-time as you type with full interactivity
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                QTI 2.1 & 3.0
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Full support for both QTI 2.1 and 3.0 specifications with automatic version detection
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Example Library
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Ready-to-use templates and examples for all question types to get started quickly
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Interactive Docs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Comprehensive documentation with live examples you can edit and test
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-100 dark:bg-pink-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Github className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Open Source
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Free and open source with an active community contributing improvements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to create your first QTI assessment?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join developers and educators using QTI Playground to build interactive assessments
          </p>
          <Link to="/playground">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-200 px-8 py-6 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Playground
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;