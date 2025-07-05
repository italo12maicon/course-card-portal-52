
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { Play, Settings, Bell, User, Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentView?: "member" | "admin";
  onViewChange?: (view: "member" | "admin") => void;
}

export function Layout({ children, currentView = "member", onViewChange }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [notifications] = useState([
    { 
      id: 1, 
      message: "Bem-vindos à nossa plataforma de cursos online!", 
      type: "info",
      hasButton: true,
      buttonText: "Explorar Cursos",
      buttonUrl: "#courses"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {/* Header */}
        <header className="bg-netflix-dark/90 backdrop-blur-sm border-b border-netflix-gray sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-foreground lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-netflix-red flex items-center gap-2">
                  <Play className="h-6 w-6" />
                  StreamLearn
                </h1>
                {onViewChange && (
                  <nav className="hidden md:flex space-x-4">
                    <Button 
                      variant={currentView === "member" ? "default" : "ghost"}
                      onClick={() => onViewChange("member")}
                      className="transition-all duration-300"
                    >
                      Meus Cursos
                    </Button>
                    <Button 
                      variant={currentView === "admin" ? "default" : "ghost"}
                      onClick={() => onViewChange("admin")}
                      className="transition-all duration-300"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Painel Admin
                    </Button>
                  </nav>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-gradient-primary">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white">
                  <Bell className="h-4 w-4" />
                  <span>{notifications[0].message}</span>
                </div>
                {notifications[0].hasButton && notifications[0].buttonText && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => {
                      if (notifications[0].buttonUrl?.startsWith('#')) {
                        document.querySelector(notifications[0].buttonUrl)?.scrollIntoView();
                      } else if (notifications[0].buttonUrl) {
                        window.open(notifications[0].buttonUrl, '_blank');
                      }
                    }}
                  >
                    {notifications[0].buttonText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
