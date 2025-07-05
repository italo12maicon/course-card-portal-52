import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Edit, Trash2, Users, Video, Bell, BookOpen, 
  Settings, BarChart3, UserPlus, Lock, Unlock, 
  Eye, EyeOff, Palette, Type, Image, Monitor,
  Shield, Activity, Globe, Database, Zap,
  TrendingUp, Target, Award, MessageSquare
} from "lucide-react";
import { Course, User, Notification, Banner } from "@/types";
import { useToast } from "@/hooks/use-toast";
import reactCourse from "@/assets/react-course.jpg";

interface SiteSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;  
}

export function AdminPanel() {
  const { toast } = useToast();

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 8,
    activeCourses: 6,
    totalRevenue: 12500,
    monthlyRevenue: 3200,
    activeNotifications: 2,
    activeBanners: 1,
    completionRate: 68,
    averageRating: 4.7
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "StreamLearn",
    logo: "",
    primaryColor: "#E50914",
    secondaryColor: "#221F1F",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true
  });

  // Users Management with IP tracking
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    setUsers(adminUsers);
    setStats(prev => ({
      ...prev,
      totalUsers: adminUsers.length,
      activeUsers: adminUsers.filter((u: User) => u.isActive).length
    }));
  }, []);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Courses Management
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "React Fundamentals",
      description: "Master the basics of React development",
      videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
      thumbnail: reactCourse,
      isLocked: false,
      category: "Frontend",
      isFree: true,
      duration: "2h 30m",
      progress: 0,
      hasAccess: true,
      rating: 4.8,
      students: 1250,
      topics: []
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    category: "",
    isLocked: true,
    isFree: false
  });

  // Banners Management
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      title: "🚀 Promoção Especial: 50% OFF",
      description: "Aproveite nossa promoção especial e tenha acesso a todos os cursos premium com 50% de desconto!",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1080&h=1920&fit=crop",
      link: "#courses",
      buttonText: "Aproveitar Oferta",
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [newBanner, setNewBanner] = useState<Omit<Banner, 'id' | 'createdAt'>>({
    title: "",
    description: "",
    image: "",
    link: "",
    buttonText: "",
    isActive: true
  });

  // Notifications Management
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Bem-vindos à nossa plataforma de cursos online!",
      type: "info",
      isActive: true,
      hasButton: true,
      buttonText: "Explorar Cursos",
      buttonUrl: "#courses"
    }
  ]);

  const [newNotification, setNewNotification] = useState<{
    message: string;
    type: "info" | "warning" | "success";
    hasButton: boolean;
    buttonText: string;
    buttonUrl: string;
  }>({
    message: "",
    type: "info",
    hasButton: false,
    buttonText: "",
    buttonUrl: ""
  });

  // Handlers
  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now(),
        name: newUser.name,
        email: newUser.email,
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        accessibleCourses: [],
        ipAddress: "Manual Admin Creation",
        lastLogin: new Date().toISOString(),
        loginCount: 0
      };
      
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      setNewUser({ name: "", email: "", password: "" });
      
      toast({
        title: "Usuário criado com sucesso!",
        description: `${user.name} foi adicionado à plataforma.`
      });
    }
  };

  const handleToggleUserAccess = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Status do usuário atualizado",
      description: "O acesso do usuário foi modificado."
    });
  };

  const handleToggleCourseAccess = (userId: number, courseId: number) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const hasAccess = user.accessibleCourses.includes(courseId);
        return {
          ...user,
          accessibleCourses: hasAccess 
            ? user.accessibleCourses.filter(id => id !== courseId)
            : [...user.accessibleCourses, courseId]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Acesso ao curso atualizado",
      description: "As permissões do usuário foram modificadas."
    });
  };

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.description) {
      const course: Course = {
        id: Date.now(),
        ...newCourse,
        duration: "0h 0m",
        progress: 0,
        hasAccess: false,
        rating: 0,
        students: 0,
        topics: []
      };
      setCourses([...courses, course]);
      setNewCourse({
        title: "",
        description: "",
        videoUrl: "",
        thumbnail: "",
        category: "",
        isLocked: true,
        isFree: false
      });
      
      toast({
        title: "Curso adicionado com sucesso!",
        description: `${course.title} foi criado na plataforma.`
      });
    }
  };

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.description) {
      const banner: Banner = {
        id: Date.now(),
        ...newBanner,
        createdAt: new Date().toISOString()
      };
      setBanners([...banners, banner]);
      setNewBanner({
        title: "",
        description: "",
        image: "",
        link: "",
        buttonText: "",
        isActive: true
      });
      
      toast({
        title: "Banner criado com sucesso!",
        description: `${banner.title} foi adicionado ao carrossel.`
      });
    }
  };

  const handleToggleBanner = (bannerId: number) => {
    setBanners(banners.map(banner =>
      banner.id === bannerId
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ));
    
    toast({
      title: "Status do banner atualizado",
      description: "A visibilidade do banner foi modificada."
    });
  };

  const handleDeleteBanner = (bannerId: number) => {
    setBanners(banners.filter(banner => banner.id !== bannerId));
    
    toast({
      title: "Banner removido",
      description: "O banner foi excluído do carrossel."
    });
  };

  const handleAddNotification = () => {
    if (newNotification.message) {
      const notification: Notification = {
        id: Date.now(),
        ...newNotification,
        isActive: true
      };
      setNotifications([...notifications, notification]);
      setNewNotification({ 
        message: "", 
        type: "info", 
        hasButton: false, 
        buttonText: "", 
        buttonUrl: "" 
      });
      
      toast({
        title: "Notificação criada!",
        description: "A notificação foi adicionada à plataforma."
      });
    }
  };

  const handleToggleNotification = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isActive: !notification.isActive }
        : notification
    ));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    
    toast({
      title: "Configurações salvas!",
      description: "As configurações da plataforma foram atualizadas."
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-neon-flicker">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground text-lg">Gerencie sua plataforma de ensino online</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-gradient-card glass-morphism">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <BookOpen className="h-4 w-4" />
            Cursos
          </TabsTrigger>
          <TabsTrigger value="banners" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Image className="h-4 w-4" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Video className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover-glow futuristic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-primary animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{stats.activeUsers} ativos</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover-glow futuristic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.activeCourses}</div>
                <p className="text-xs text-muted-foreground">{stats.totalCourses} total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover-glow futuristic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">R$ {stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">R$ {stats.totalRevenue.toLocaleString()} total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover-glow futuristic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <Target className="h-4 w-4 text-purple-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">⭐ {stats.averageRating} avaliação média</p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Atividade em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-netflix-gray/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">IP: {user.ipAddress}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                          {user.isActive ? "Online" : "Offline"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.loginCount} logins
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Servidor Principal</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de Dados</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Conectado</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Operacional</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificações</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-yellow-500">{stats.activeNotifications} ativas</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Banners</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-500">{stats.activeBanners} ativo(s)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Users Management Tab */}
        <TabsContent value="users" className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create User */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Criar Novo Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome Completo</Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Digite o nome completo"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userEmail">E-mail</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Digite o e-mail"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userPassword">Senha Inicial</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Digite a senha inicial"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <Button onClick={handleCreateUser} className="w-full bg-gradient-primary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </Button>
              </CardContent>
            </Card>

            {/* User List with IP tracking */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Usuários Cadastrados ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="space-y-4 p-4 bg-netflix-gray/30 rounded-lg border border-muted/20 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {user.name}
                          {user.isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                        </h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>📅 {user.registrationDate}</span>
                          <span>🌐 {user.ipAddress}</span>
                          <span>🔑 {user.loginCount} logins</span>
                        </div>
                        <Badge variant={user.isActive ? "default" : "secondary"} className="mt-2">
                          {user.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleUserAccess(user.id)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Acesso aos Cursos:</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {courses.map((course) => (
                          <div key={course.id} className="flex items-center justify-between text-sm p-2 bg-background/50 rounded">
                            <span className="text-foreground">{course.title}</span>
                            <div className="flex items-center gap-2">
                              {course.isFree ? (
                                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">Grátis</Badge>
                              ) : (
                                <Switch
                                  checked={user.accessibleCourses.includes(course.id)}
                                  onCheckedChange={() => handleToggleCourseAccess(user.id, course.id)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum usuário cadastrado ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banners Management Tab */}
        <TabsContent value="banners" className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Banner */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Criar Novo Banner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bannerTitle">Título do Banner</Label>
                  <Input
                    id="bannerTitle"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    placeholder="Ex: 🚀 Promoção Especial: 50% OFF"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bannerDescription">Descrição</Label>
                  <Textarea
                    id="bannerDescription"
                    value={newBanner.description}
                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                    placeholder="Descrição detalhada da promoção ou novidade"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bannerImage">URL da Imagem</Label>
                  <Input
                    id="bannerImage"
                    value={newBanner.image}
                    onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bannerLink">Link de Destino</Label>
                  <Input
                    id="bannerLink"
                    value={newBanner.link}
                    onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                    placeholder="#courses ou https://exemplo.com"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bannerButtonText">Texto do Botão</Label>
                  <Input
                    id="bannerButtonText"
                    value={newBanner.buttonText}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                    placeholder="Ex: Aproveitar Oferta"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bannerActive"
                    checked={newBanner.isActive}
                    onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                  />
                  <Label htmlFor="bannerActive">Banner Ativo</Label>
                </div>
                
                <Button onClick={handleAddBanner} className="w-full bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Banner
                </Button>
              </CardContent>
            </Card>

            {/* Banner List */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-blue-500" />
                  Banners Existentes ({banners.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {banners.map((banner) => (
                  <div key={banner.id} className="p-4 bg-netflix-gray/30 rounded-lg border border-muted/20 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{banner.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{banner.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={banner.isActive ? "default" : "secondary"} className="text-xs">
                            {banner.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => handleToggleBanner(banner.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {banner.image && (
                      <div className="relative h-16 rounded overflow-hidden bg-muted">
                        <img 
                          src={banner.image} 
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p>🔗 Link: {banner.link}</p>
                      <p>🔘 Botão: {banner.buttonText}</p>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum banner criado ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Course */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Adicionar Novo Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="Digite o título do curso"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="Digite a descrição do curso"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL do Vídeo</Label>
                  <Input
                    id="videoUrl"
                    value={newCourse.videoUrl}
                    onChange={(e) => setNewCourse({ ...newCourse, videoUrl: e.target.value })}
                    placeholder="YouTube, Vimeo ou Facebook"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">URL da Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                    placeholder="URL da imagem (1080x1920)"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    placeholder="Ex: Frontend, Backend, Design"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="free"
                      checked={newCourse.isFree}
                      onCheckedChange={(checked) => setNewCourse({ ...newCourse, isFree: checked })}
                    />
                    <Label htmlFor="free">Curso Gratuito</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="locked"
                      checked={newCourse.isLocked}
                      onCheckedChange={(checked) => setNewCourse({ ...newCourse, isLocked: checked })}
                    />
                    <Label htmlFor="locked">Inicialmente Bloqueado</Label>
                  </div>
                </div>
                
                <Button onClick={handleAddCourse} className="w-full bg-gradient-primary">
                  Adicionar Curso
                </Button>
              </CardContent>
            </Card>

            {/* Course List */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle>Cursos Existentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-netflix-gray/30 rounded-lg border border-muted/20 hover:border-primary/30 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.category}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={course.isFree ? "default" : "secondary"}>
                          {course.isFree ? "Grátis" : "Pago"}
                        </Badge>
                        <Badge variant={course.isLocked ? "destructive" : "outline"}>
                          {course.isLocked ? "Bloqueado" : "Liberado"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum curso criado ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Notification */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Criar Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationMessage">Mensagem</Label>
                  <Textarea
                    id="notificationMessage"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Digite a mensagem da notificação"
                    className="bg-netflix-gray/50 border-muted focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notificationType">Tipo</Label>
                  <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value as "info" | "warning" | "success" })}>
                    <SelectTrigger className="bg-netflix-gray/50 border-muted focus:border-primary">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasButton"
                    checked={newNotification.hasButton}
                    onCheckedChange={(checked) => setNewNotification({ ...newNotification, hasButton: checked })}
                  />
                  <Label htmlFor="hasButton">Adicionar Botão de Ação</Label>
                </div>
                
                {newNotification.hasButton && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="buttonText">Texto do Botão</Label>
                      <Input
                        id="buttonText"
                        value={newNotification.buttonText}
                        onChange={(e) => setNewNotification({ ...newNotification, buttonText: e.target.value })}
                        placeholder="Ex: Ver Cursos"
                        className="bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buttonUrl">URL do Botão</Label>
                      <Input
                        id="buttonUrl"
                        value={newNotification.buttonUrl}
                        onChange={(e) => setNewNotification({ ...newNotification, buttonUrl: e.target.value })}
                        placeholder="Ex: #courses ou https://..."
                        className="bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                    </div>
                  </>
                )}
                
                <Button onClick={handleAddNotification} className="w-full bg-gradient-primary">
                  Criar Notificação
                </Button>
              </CardContent>
            </Card>

            {/* Notification List */}
            <Card className="bg-gradient-card border-netflix-gray hover-glow">
              <CardHeader>
                <CardTitle>Notificações Ativas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start justify-between p-4 bg-netflix-gray/30 rounded-lg border border-muted/20 hover:border-primary/30 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={notification.isActive ? "default" : "secondary"}>
                          {notification.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                        <Badge variant="outline">
                          {notification.type}
                        </Badge>
                        {notification.hasButton && (
                          <Badge variant="outline">
                            Com Botão
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={notification.isActive}
                      onCheckedChange={() => handleToggleNotification(notification.id)}
                    />
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação criada ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 animate-slide-up">
          <Card className="bg-gradient-card border-netflix-gray hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configurações da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Nome da Plataforma
                    </Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      placeholder="Nome da sua plataforma"
                      className="bg-netflix-gray/50 border-muted focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      URL do Logo
                    </Label>
                    <Input
                      id="logo"
                      value={siteSettings.logo}
                      onChange={(e) => setSiteSettings({ ...siteSettings, logo: e.target.value })}
                      placeholder="URL do seu logo"
                      className="bg-netflix-gray/50 border-muted focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Cor Primária
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                        className="w-16 h-10 bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                      <Input
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                        placeholder="#E50914"
                        className="flex-1 bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Cor Secundária
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })}
                        className="w-16 h-10 bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                      <Input
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })}
                        placeholder="#221F1F"
                        className="flex-1 bg-netflix-gray/50 border-muted focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Modo de Manutenção</Label>
                  <Switch
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, maintenanceMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Cadastro de Usuários</Label>
                  <Switch
                    checked={siteSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, registrationEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Notificações por E-mail</Label>
                  <Switch
                    checked={siteSettings.emailNotifications}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, emailNotifications: checked })}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-netflix-gray">
                <Button onClick={handleSaveSettings} className="w-full lg:w-auto bg-gradient-primary">
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 animate-slide-up">
          <Card className="bg-gradient-card border-netflix-gray hover-glow">
            <CardHeader>
              <CardTitle>Dashboard de Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recursos de analytics em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 animate-slide-up">
          <Card className="bg-gradient-card border-netflix-gray hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Monitoramento de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    IPs Ativos
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array.from(new Set(users.map(u => u.ipAddress))).map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-netflix-gray/30 rounded text-sm">
                        <span>{ip}</span>
                        <Badge variant="outline" className="text-xs">
                          {users.filter(u => u.ipAddress === ip).length} usuário(s)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Logs de Acesso
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="p-2 bg-netflix-gray/30 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.ipAddress} • {user.loginCount} logins
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
