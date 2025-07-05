import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Volume2, 
  Moon, 
  Sun,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  BookOpen,
  Play
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    autoplay: true,
    darkMode: true,
    volume: 75,
    quality: "1080p"
  });

  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao@email.com",
    avatar: ""
  });

  const menuItems = [
    {
      icon: User,
      label: "Perfil",
      id: "profile"
    },
    {
      icon: BookOpen,
      label: "Meus Cursos",
      id: "courses"
    },
    {
      icon: Play,
      label: "Continuar Assistindo",
      id: "continue"
    },
    {
      icon: Bell,
      label: "Notificações",
      id: "notifications"
    },
    {
      icon: Settings,
      label: "Configurações",
      id: "settings"
    },
    {
      icon: Shield,
      label: "Privacidade",
      id: "privacy"
    }
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="bg-netflix-gray border-muted">
            <CardHeader>
              <CardTitle className="text-sm">Perfil do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="profileName" className="text-xs">Nome</Label>
                  <Input
                    id="profileName"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-background border-muted text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileEmail" className="text-xs">E-mail</Label>
                  <Input
                    id="profileEmail"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-background border-muted text-sm"
                  />
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "settings":
        return (
          <Card className="bg-netflix-gray border-muted">
            <CardHeader>
              <CardTitle className="text-sm">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Tema Escuro</Label>
                    <p className="text-xs text-muted-foreground">Alternar entre modo claro e escuro</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Reprodução Automática</Label>
                    <p className="text-xs text-muted-foreground">Iniciar vídeos automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Volume</Label>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) => setSettings({ ...settings, volume: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground w-8">{settings.volume}%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Qualidade Padrão</Label>
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings({ ...settings, quality: e.target.value })}
                    className="w-full p-2 text-xs bg-background border border-muted rounded-md"
                  >
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card className="bg-netflix-gray border-muted">
            <CardHeader>
              <CardTitle className="text-sm">Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">Receber notificações no dispositivo</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-xs font-medium">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Novos cursos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Progresso de cursos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Lembretes de estudo</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Atualizações da plataforma</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="bg-netflix-gray border-muted">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Selecione uma opção no menu</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-netflix-dark border-r border-netflix-gray transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-80'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-netflix-gray">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">StreamLearn</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start mb-1 ${isCollapsed ? 'px-3' : 'px-4'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Content Area */}
        {!isCollapsed && (
          <div className="p-4">
            {renderContent()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-netflix-gray">
        <Button
          variant="ghost"
          className={`w-full justify-start text-muted-foreground hover:text-foreground ${isCollapsed ? 'px-3' : 'px-4'}`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3 text-sm">Sair</span>}
        </Button>
      </div>
    </div>
  );
}