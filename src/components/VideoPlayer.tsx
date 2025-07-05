import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Users } from "lucide-react";

interface VideoPlayerProps {
  course: {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    progress: number;
    category: string;
  };
  onBack: () => void;
}

export function VideoPlayer({ course, onBack }: VideoPlayerProps) {
  const [currentProgress, setCurrentProgress] = useState(course.progress);

  const getEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    
    // Handle Facebook URLs
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
    }
    
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Cursos
        </Button>
        <Badge variant="outline">{course.category}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-netflix-gray overflow-hidden">
            <div className="aspect-video relative">
              <iframe
                src={getEmbedUrl(course.videoUrl)}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={course.title}
              />
            </div>
          </Card>
          
          <Card className="bg-card border-netflix-gray">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>1,250 alunos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Info Sidebar */}
        <div className="space-y-4">
          <Card className="bg-card border-netflix-gray">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Progresso do Curso</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completo</span>
                  <span className="text-foreground font-medium">{currentProgress}%</span>
                </div>
                <Progress value={currentProgress} className="h-3" />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentProgress(Math.min(100, currentProgress + 10))}
                >
                  Marcar como Concluído
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-netflix-gray">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Conteúdo do Curso</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-netflix-gray rounded-lg">
                  <span className="text-sm text-foreground">1. Introdução</span>
                  <span className="text-xs text-muted-foreground">5 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-netflix-gray rounded-lg">
                  <span className="text-sm text-foreground">2. Conceitos Básicos</span>
                  <span className="text-xs text-muted-foreground">15 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-netflix-gray rounded-lg">
                  <span className="text-sm text-foreground">3. Prática</span>
                  <span className="text-xs text-muted-foreground">25 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}