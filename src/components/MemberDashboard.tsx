import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseTopics } from "./CourseTopics";
import { BannerCarousel } from "./BannerCarousel";
import { Play, Clock, BookOpen, Lock, Star, TrendingUp, Trophy, Target, Zap } from "lucide-react";
import { Course, Banner } from "@/types";
import reactCourse from "@/assets/react-course.jpg";
import typescriptCourse from "@/assets/typescript-course.jpg";
import nodejsCourse from "@/assets/nodejs-course.jpg";
import databaseCourse from "@/assets/database-course.jpg";

export function MemberDashboard() {
  const [currentUserId] = useState(1);
  const [userAccessibleCourses] = useState([1, 2]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Banners do carrossel
  const [banners] = useState<Banner[]>([
    {
      id: 1,
      title: "🚀 Promoção Especial: 50% OFF",
      description: "Aproveite nossa promoção especial e tenha acesso a todos os cursos premium com 50% de desconto!",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1080&h=1920&fit=crop",
      link: "#courses",
      buttonText: "Aproveitar Oferta",
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "🎯 Novo Curso: Full Stack Master",
      description: "Domine desenvolvimento full-stack do zero ao avançado com nosso novo curso completo!",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&h=1920&fit=crop",
      link: "#courses",
      buttonText: "Começar Agora",
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "React Fundamentals",
      description: "Master the basics of React development with hooks, components, and modern patterns. Learn to build interactive UIs with confidence.",
      videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
      thumbnail: reactCourse,
      duration: "2h 30m",
      progress: 65,
      category: "Frontend",
      isLocked: false,
      isFree: true,
      hasAccess: true,
      rating: 4.8,
      students: 1250,
      topics: [
        {
          id: 1,
          title: "Introdução ao React",
          description: "Aprenda os conceitos fundamentais do React e configure seu ambiente de desenvolvimento.",
          thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1080&h=1920&fit=crop",
          progress: 100,
          lessons: [
            {
              id: 1,
              title: "O que é React?",
              description: "Entenda o que é o React e por que ele é tão popular no desenvolvimento frontend.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "15m",
              isCompleted: true
            },
            {
              id: 2,
              title: "Configurando o Ambiente",
              description: "Configure seu ambiente de desenvolvimento para começar a trabalhar com React.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "20m",
              isCompleted: true
            }
          ]
        },
        {
          id: 2,
          title: "Componentes e Props",
          description: "Aprenda a criar componentes reutilizáveis e como passar dados entre eles usando props.",
          thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&h=1920&fit=crop",
          progress: 50,
          lessons: [
            {
              id: 3,
              title: "Criando Componentes",
              description: "Aprenda a criar seus primeiros componentes em React.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "25m",
              isCompleted: true
            },
            {
              id: 4,
              title: "Usando Props",
              description: "Entenda como passar dados entre componentes usando props.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "30m",
              isCompleted: false
            }
          ]
        },
        {
          id: 3,
          title: "Hooks e Estado",
          description: "Domine os hooks do React para gerenciar estado e efeitos colaterais.",
          thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1080&h=1920&fit=crop",
          progress: 0,
          lessons: [
            {
              id: 5,
              title: "useState Hook",
              description: "Aprenda a gerenciar estado local dos componentes com useState.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "35m",
              isCompleted: false
            },
            {
              id: 6,
              title: "useEffect Hook",
              description: "Entenda como lidar com efeitos colaterais usando useEffect.",
              videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
              duration: "40m",
              isCompleted: false
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "TypeScript Essentials",
      description: "Learn TypeScript fundamentals and advanced features for better code quality. Build type-safe applications with confidence.",
      videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
      thumbnail: typescriptCourse,
      duration: "3h 15m",
      progress: 20,
      category: "Frontend",
      isLocked: false,
      isFree: false,
      hasAccess: userAccessibleCourses.includes(2),
      rating: 4.9,
      students: 890,
      topics: [
        {
          id: 4,
          title: "Fundamentos do TypeScript",
          description: "Aprenda os conceitos básicos do TypeScript e como ele melhora o JavaScript.",
          thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1080&h=1920&fit=crop",
          progress: 60,
          lessons: [
            {
              id: 7,
              title: "Introdução ao TypeScript",
              description: "Entenda o que é TypeScript e suas vantagens sobre JavaScript.",
              videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
              duration: "20m",
              isCompleted: true
            },
            {
              id: 8,
              title: "Tipos Básicos",
              description: "Aprenda sobre os tipos básicos do TypeScript.",
              videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
              duration: "25m",
              isCompleted: false
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      description: "Build scalable backend applications with Node.js, Express, and databases. Master server-side development.",
      videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4",
      thumbnail: nodejsCourse,
      duration: "4h 20m",
      progress: 0,
      category: "Backend",
      isLocked: true,
      isFree: false,
      hasAccess: userAccessibleCourses.includes(3),
      rating: 4.7,
      students: 645,
      topics: []
    },
    {
      id: 4,
      title: "Database Design & SQL",
      description: "Master database design principles and SQL for efficient data management. Learn to structure and query databases.",
      videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
      thumbnail: databaseCourse,
      duration: "3h 45m",
      progress: 0,
      category: "Database",
      isLocked: true,
      isFree: false,
      hasAccess: userAccessibleCourses.includes(4),
      rating: 4.6,
      students: 432,
      topics: []
    },
    {
      id: 5,
      title: "Advanced React Patterns",
      description: "Deep dive into advanced React patterns, performance optimization, and complex state management.",
      videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
      thumbnail: reactCourse,
      duration: "5h 10m",
      progress: 0,
      category: "Frontend",
      isLocked: true,
      isFree: false,
      hasAccess: false,
      rating: 4.9,
      students: 789,
      topics: []
    },
    {
      id: 6,
      title: "Full Stack JavaScript",
      description: "Complete full-stack development course covering frontend, backend, and database integration.",
      videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4",
      thumbnail: nodejsCourse,
      duration: "8h 30m",
      progress: 0,
      category: "Full Stack",
      isLocked: true,
      isFree: false,
      hasAccess: false,
      rating: 4.8,
      students: 567,
      topics: []
    }
  ]);

  const availableCourses = courses.filter(course => course.isFree || course.hasAccess);
  const lockedCourses = courses.filter(course => !course.isFree && !course.hasAccess);

  const handleCourseSelect = (course: Course) => {
    if (course.isFree || course.hasAccess) {
      setSelectedCourse(course);
    }
  };

  if (selectedCourse) {
    return (
      <CourseTopics
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Carousel */}
      <BannerCarousel banners={banners} />

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Meus Cursos
        </h1>
        <p className="text-muted-foreground text-lg">Continue aprendendo e desenvolva suas habilidades</p>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-netflix transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full animate-pulse">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{availableCourses.length}</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(availableCourses.reduce((acc, course) => acc + course.progress, 0) / Math.max(availableCourses.length, 1))}%
                </p>
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
                <p className="text-2xl font-bold text-foreground">{availableCourses.filter(c => c.progress === 100).length}</p>
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
                <p className="text-2xl font-bold text-foreground">{availableCourses.filter(c => c.progress > 0 && c.progress < 100).length}</p>
                <p className="text-sm text-muted-foreground">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {course.isFree ? (
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
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs bg-black/50 text-white">
                      {course.topics.length} tópicos
                    </Badge>
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
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white text-xs opacity-70">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{course.rating}</span>
                      </div>
                      <span>{course.students} alunos</span>
                    </div>
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
                  <Button 
                    variant="outline" 
                    className="w-full text-xs" 
                    disabled
                  >
                    <Lock className="h-3 w-3 mr-2" />
                    Acesso Restrito
                  </Button>
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
