import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, LogIn } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  registrationDate: string;
  accessibleCourses: number[];
}

interface UserRegistrationProps {
  onUserRegistered: (user: User) => void;
}

export function UserRegistration({ onUserRegistered }: UserRegistrationProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.email) newErrors.push("E-mail é obrigatório");
    if (!formData.password) newErrors.push("Senha é obrigatória");
    
    if (!isLogin) {
      if (!formData.name) newErrors.push("Nome é obrigatório");
      if (formData.password !== formData.confirmPassword) {
        newErrors.push("Senhas não coincidem");
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isLogin) {
      // Register new user
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        accessibleCourses: [] // New users have no access by default
      };
      
      onUserRegistered(newUser);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setErrors([]);
    } else {
      // Login logic would go here
      console.log("Login attempt:", { email: formData.email });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-netflix-gray">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            {isLogin ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            {isLogin ? "Fazer Login" : "Criar Conta"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? "Entre com suas credenciais" : "Cadastre-se para acessar os cursos"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite seu nome completo"
                  className="bg-netflix-gray border-muted"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Digite seu e-mail"
                className="bg-netflix-gray border-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Digite sua senha"
                className="bg-netflix-gray border-muted"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirme sua senha"
                  className="bg-netflix-gray border-muted"
                />
              </div>
            )}
            
            {errors.length > 0 && (
              <div className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors([]);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: ""
                });
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
            </Button>
          </div>
          
          {!isLogin && (
            <div className="text-xs text-muted-foreground text-center p-4 bg-netflix-gray rounded-lg">
              <p><strong>Importante:</strong> Após o cadastro, você terá acesso limitado aos cursos.</p>
              <p>O administrador precisa liberar o acesso individual para cada curso.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}