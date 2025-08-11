import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
// Removed unused TanStack Query
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Playground from "./pages/Playground";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ItemEditor from "./pages/ItemEditor";
import AssessmentEditor from "./pages/AssessmentEditor";
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
import BestPractices from "./components/learn/sections/BestPractices";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";

const App = () => (
  <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AppLayout>
              <div className="flex-1">
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/playground" element={<Projects />} />
                <Route path="/playground-old" element={<Playground />} />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route path="/project/:projectId/item-editor" element={<ItemEditor />} />
                <Route path="/project/:projectId/assessment-editor" element={<AssessmentEditor />} />
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
                  <Route path="best-practices" element={<BestPractices />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </AppLayout>
        </AuthProvider>
        </BrowserRouter>
      </div>
  </TooltipProvider>
);

export default App;
