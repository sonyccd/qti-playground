import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight, ChevronLeft } from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction to QTI", path: "/learn/introduction" },
  { id: "structure", title: "Assessment Structure", path: "/learn/structure" },
  { id: "anatomy", title: "Basic Anatomy", path: "/learn/anatomy" },
  { id: "assessment-item", title: "Assessment Item Tag", path: "/learn/assessment-item" },
  { id: "response-declaration", title: "Response Declaration", path: "/learn/response-declaration" },
  { id: "item-body", title: "Item Body", path: "/learn/item-body" },
  { id: "answer-choices", title: "Answer Choices", path: "/learn/answer-choices" },
  { id: "response-processing", title: "Response Processing", path: "/learn/response-processing" },
  { id: "assessment-test", title: "Assessment Test", path: "/learn/assessment-test" },
  { id: "organizing-files", title: "Organizing Files", path: "/learn/organizing-files" },
  { id: "tools", title: "Tools for QTI", path: "/learn/tools" },
  { id: "best-practices", title: "Best Practices", path: "/learn/best-practices" },
  { id: "summary", title: "Summary", path: "/learn/summary" },
];

export default function LearnLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const currentIndex = sections.findIndex(section => section.path === currentPath);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                QTI Documentation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sections.map((section) => (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={section.path}
                          className={currentPath === section.path ? "bg-accent text-accent-foreground" : ""}
                        >
                          {section.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b p-4">
            <SidebarTrigger />
          </header>
          
          <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <Outlet />
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <div>
                {prevSection && (
                  <Button variant="outline" asChild>
                    <Link to={prevSection.path} className="flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      {prevSection.title}
                    </Link>
                  </Button>
                )}
              </div>
              <div>
                {nextSection && (
                  <Button asChild>
                    <Link to={nextSection.path} className="flex items-center gap-2">
                      {nextSection.title}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}