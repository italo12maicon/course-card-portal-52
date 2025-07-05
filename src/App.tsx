// src/App.tsx

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/LoginForm";
import { Layout } from "@/components/Layout";
import { SupabaseMemberDashboard } from "@/components/SupabaseMemberDashboard";
import { AdminPanel } from "@/components/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas que exigem autenticação
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Componente para proteger rotas que exigem privilégios de administrador
function AdminRoute({ children }: { children: JSX.Element }) {
    const { isAdmin } = useAuth();
    if (!isAdmin) {
        // Se não for admin, redireciona para a página principal
        return <Navigate to="/" replace />;
    }
    return children;
}

// Componente que decide o que renderizar com base no estado de autenticação
function AppContent() {
  const { loading, isAuthenticated } = useAuth();

  // 1. Mostra a tela de carregamento enquanto o Supabase verifica a sessão
  if (loading) {
    return (
      <div className="matrix-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // 2. Após o carregamento, define as rotas da aplicação
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />} />

        {/* Rota Principal (Dashboard) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <SupabaseMemberDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota do Painel Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


// Componente Raiz da Aplicação
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="matrix-bg min-h-screen">
          <Sonner position="top-right" richColors />
          <AppContent />
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
