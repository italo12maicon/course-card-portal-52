// src/components/AuthProvider.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Usando o sonner para notificações mais ricas

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Deriva o estado de autenticação diretamente da existência de uma sessão
  const isAuthenticated = !!session;

  /**
   * Verifica no banco de dados se o usuário logado tem a flag 'is_admin'.
   * @param userId - O ID do usuário a ser verificado.
   */
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        // Não mostra erro no console se for apenas porque o usuário ainda não existe na tabela 'users'
        if (error.code !== 'PGRST116') {
            console.error('Error checking admin status:', error.message);
        }
        return false;
      }
      return data?.is_admin || false;
    } catch (error) {
      console.error('Exception in checkAdminStatus:', error);
      return false;
    }
  };

  /**
   * Função para registrar o login de um usuário no banco, chamando uma RPC.
   */
  const registerUserLogin = async () => {
    try {
      // A RPC `register_login` já usa auth.uid() internamente no SQL,
      // então não precisamos passar o ID do usuário.
      // Ela também pode obter o IP do lado do servidor se configurada para isso.
      const { error } = await supabase.rpc('register_login', {
        // Os argumentos user_ip e user_agent_string são opcionais na definição da função SQL
      });

      if (error) {
        console.error('Error registering login via RPC:', error.message);
      }
    } catch (error) {
      console.error('Exception in registerUserLogin:', error);
    }
  };

  /**
   * Efetua o login do usuário.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Erro no login", { description: "Credenciais inválidas. Verifique seu e-mail e senha." });
      return false;
    }

    if (data.session) {
      // A lógica de atualização de estado (user, session, isAdmin)
      // será tratada pelo onAuthStateChange para evitar duplicação.
      toast.success("Login realizado com sucesso!", { description: "Bem-vindo de volta!" });
      return true;
    }
    
    return false;
  };

  /**
   * Registra um novo usuário no sistema.
   */
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Adiciona metadados que serão usados pelo trigger para criar o perfil do usuário
        data: {
          name: name,
        },
      },
    });

    if (error) {
      toast.error("Erro no cadastro", { description: error.message });
      return false;
    }

    if (data.user) {
        toast.success("Cadastro realizado com sucesso!", {
            description: "Enviamos um link de confirmação para o seu e-mail.",
        });
        return true;
    }

    return false;
  };

  /**
   * Desconecta o usuário do sistema.
   */
  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast.error("Erro ao sair", { description: error.message });
    } else {
        // O onAuthStateChange cuidará de limpar os estados user, session e isAdmin
        toast.info("Você foi desconectado.");
    }
  };

  // Efeito principal para gerenciar o estado de autenticação da aplicação
  useEffect(() => {
    setLoading(true);
    
    // 1. Tenta obter a sessão inicial ao carregar o app
    supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            const adminStatus = await checkAdminStatus(currentUser.id);
            setIsAdmin(adminStatus);
        }
        // Garante que o loading termine após a verificação inicial
        setLoading(false);
    });

    // 2. Escuta mudanças no estado de autenticação (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const adminStatus = await checkAdminStatus(currentUser.id);
          setIsAdmin(adminStatus);
          
          if (event === 'SIGNED_IN') {
            await registerUserLogin();
          }
        } else {
          // Garante que o estado de admin seja limpo ao fazer logout
          setIsAdmin(false);
        }
        
        // Garante que o loading termine após qualquer mudança de estado
        setLoading(false);
      }
    );

    // Limpa a inscrição ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    login,
    logout,
    register,
    isAuthenticated,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
