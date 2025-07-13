import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Playground from "./pages/Playground";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import LearnLayout from "./components/learn/LearnLayout";
import Introduction from "./components/learn/sections/Introduction";
import Structure from "./components/learn/sections/Structure";
import Anatomy from "./components/learn/sections/Anatomy";
import AssessmentItem from "./components/learn/sections/AssessmentItem";
import ResponseDeclaration from "./components/learn/sections/ResponseDeclaration";
import ItemBody from "./components/learn/sections/ItemBody";
import AnswerChoices from "./components/learn/sections/AnswerChoices";
import ResponseProcessing from "./components/learn/sections/ResponseProcessing";
import AssessmentTest from "./components/learn/sections/AssessmentTest";
import OrganizingFiles from "./components/learn/sections/OrganizingFiles";
import Tools from "./components/learn/sections/Tools";
import BestPractices from "./components/learn/sections/BestPractices";
import Summary from "./components/learn/sections/Summary";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/learn" element={<LearnLayout />}>
                  <Route index element={<Introduction />} />
                  <Route path="introduction" element={<Introduction />} />
                  <Route path="structure" element={<Structure />} />
                  <Route path="anatomy" element={<Anatomy />} />
                  <Route path="assessment-item" element={<AssessmentItem />} />
                  <Route path="response-declaration" element={<ResponseDeclaration />} />
                  <Route path="item-body" element={<ItemBody />} />
                  <Route path="answer-choices" element={<AnswerChoices />} />
                  <Route path="response-processing" element={<ResponseProcessing />} />
                  <Route path="assessment-test" element={<AssessmentTest />} />
                  <Route path="organizing-files" element={<OrganizingFiles />} />
                  <Route path="tools" element={<Tools />} />
                  <Route path="best-practices" element={<BestPractices />} />
                  <Route path="summary" element={<Summary />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </AppLayout>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
