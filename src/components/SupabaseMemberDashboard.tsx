
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CourseTopics } from "./CourseTopics";
import { BannerCarousel } from "./BannerCarousel";
import { Play, Clock, BookOpen, Lock, Star, TrendingUp, Trophy, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  video_url: string | null;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
  is_locked: boolean;
  is_free: boolean;
  has_access: boolean;
  rating: number;
  students: number;
  topics?: Topic[];
}

interface Topic {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  is_completed: boolean;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  button_text: string;
  is_active: boolean;
  created_at: string;
}

export function SupabaseMemberDashboard() {
  const { user, session } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Buscar banners
  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Banner[];
    }
  });

  // Buscar cursos
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      if (!session) return [];

      const { data, error } = await supabase
        .from('user_courses_with_progress')
        .select('*');

      if (error) throw error;
      return data as Course[];
    },
    enabled: !!session
  });

  // Buscar estatísticas do usuário
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!session || !courses) return null;

      const availableCourses = courses.filter(c => c.is_free || c.has_access);
      const completedCourses = availableCourses.filter(c => c.progress === 100);
      const inProgressCourses = availableCourses.filter(c => c.progress > 0 && c.progress < 100);
      const avgProgress = availableCourses.length > 0 
        ? Math.round(availableCourses.reduce((acc, course) => acc + course.progress, 0) / availableCourses.length)
        : 0;

      return {
        availableCourses: availableCourses.length,
        completedCourses: completedCourses.length,
        inProgressCourses: inProgressCourses.length,
        avgProgress
      };
    },
    enabled: !!session && !!courses
  });

  const handleCourseSelect = async (course: Course) => {
    if (!course.is_free && !course.has_access) {
      toast({
        title: "Acesso Restrito",
        description: "Você não tem acesso a este curso. Entre em contato com o administrador.",
        variant: "destructive",
      });
      return;
    }

    // Buscar tópicos e aulas do curso
    try {
      const { data: topics, error } = await supabase
        .from('topics')
        .select(`
          *,
          lessons (*)
        `)
        .eq('course_id', course.id)
        .order('order_index');

      if (error) throw error;

      const courseWithTopics = {
        ...course,
        topics: topics?.map(topic => ({
          ...topic,
          lessons: topic.lessons || []
        })) || []
      };

      setSelectedCourse(courseWithTopics);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do curso",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Faça login para acessar os cursos</h2>
          <p className="text-muted-foreground">Você precisa estar logado para ver o conteúdo</p>
        </div>
      </div>
    );
  }

  if (coursesLoading || bannersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <CourseTopics
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  const availableCourses = courses?.filter(course => course.is_free || course.has_access) || [];
  const lockedCourses = courses?.filter(course => !course.is_free && !course.has_access) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Carousel */}
      {banners && banners.length > 0 && (
        <BannerCarousel banners={banners} />
      )}

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Meus Cursos
        </h1>
        <p className="text-muted-foreground text-lg">Continue aprendendo e desenvolva suas habilidades</p>
      </div>

      {/* Enhanced Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-netflix transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/20 rounded-full animate-pulse">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.availableCourses}</p>
                  <p className="text-sm text-muted-foreground">Cursos Disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-netflix transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-full animate-pulse">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.avgProgress}%</p>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-netflix transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/20 rounded-full animate-pulse">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.completedCourses}</p>
                  <p className="text-sm text-muted-foreground">Cursos Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-netflix transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-full animate-pulse">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.inProgressCourses}</p>
                  <p className="text-sm text-muted-foreground">Em Progresso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Courses */}
      {availableCourses.length > 0 && (
        <div className="space-y-6" id="courses">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            Cursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {availableCourses.map((course) => (
              <Card 
                key={course.id} 
                className="group cursor-pointer bg-card/50 backdrop-blur-sm border-netflix-gray hover:shadow-netflix transition-all duration-500 hover:scale-105 hover:border-primary/50 w-full overflow-hidden"
                onClick={() => handleCourseSelect(course)}
                style={{ aspectRatio: '9/16' }}
              >
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-primary/90 text-primary-foreground rounded-full p-4 shadow-glow animate-pulse">
                      <Play className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    {course.is_free ? (
                      <Badge className="bg-green-600 text-white text-xs animate-pulse">Grátis</Badge>
                    ) : (
                      <Badge className="bg-gradient-primary text-primary-foreground text-xs animate-pulse">Premium</Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-pulse" />
                        <span>{course.rating}</span>
                      </div>
                      <span>{course.students} alunos</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {course.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">
                    {course.description}
                  </p>
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="text-foreground font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Courses */}
      {lockedCourses.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Lock className="h-6 w-6 text-muted-foreground" />
            Cursos Bloqueados
          </h2>
          <p className="text-muted-foreground">Entre em contato com o administrador para liberar o acesso</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {lockedCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-card border-netflix-gray opacity-60 w-full"
                style={{ aspectRatio: '9/16' }}
              >
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/90 text-foreground rounded-full p-4">
                      <Lock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">Bloqueado</Badge>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{course.duration}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">
                    {course.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {availableCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">Nenhum curso disponível</h3>
            <p className="text-muted-foreground">
              Entre em contato com o administrador para liberar acesso aos cursos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
