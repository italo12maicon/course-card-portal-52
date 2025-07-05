
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/LoginForm";
import { Layout } from "@/components/Layout";
import { SupabaseMemberDashboard } from "@/components/SupabaseMemberDashboard";
import { AdminPanel } from "@/components/AdminPanel";
import { useState } from "react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<"member" | "admin">("member");

  if (loading) {
    return (
      <div className="matrix-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleViewChange = (view: "member" | "admin") => {
    if (view === "admin" && !isAdmin) {
      return; // Não permite acesso ao admin se não for admin
    }
    setCurrentView(view);
  };

  return (
    <BrowserRouter>
      <Layout 
        currentView={currentView} 
        onViewChange={isAdmin ? handleViewChange : undefined}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              currentView === "admin" && isAdmin ? (
                <AdminPanel />
              ) : (
                <SupabaseMemberDashboard />
              )
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="matrix-bg">
          <Toaster />
          <Sonner />
          <AppContent />
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
