import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, PlayCircle } from "lucide-react";
import { Topic, Lesson } from "@/types";
import { VideoPlayer } from "./VideoPlayer";

interface LessonViewerProps {
  topic: Topic;
  courseName: string;
  onBack: () => void;
}

export function LessonViewer({ topic, courseName, onBack }: LessonViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (selectedLesson) {
    return (
      <VideoPlayer
        course={{
          id: 0,
          title: selectedLesson.title,
          description: selectedLesson.description,
          videoUrl: selectedLesson.videoUrl,
          thumbnail: topic.thumbnail,
          duration: selectedLesson.duration,
          progress: 0,
          category: courseName
        }}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar aos Tópicos
        </Button>
      </div>

      {/* Topic Header */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        <img
          src={topic.thumbnail}
          alt={topic.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-end p-8">
          <div className="space-y-4">
            <Badge className="bg-primary text-primary-foreground w-fit">
              {courseName}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {topic.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">
              {topic.description}
            </p>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{topic.lessons.length} aulas</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {topic.lessons.reduce((total, lesson) => {
                    const minutes = parseInt(lesson.duration.split('m')[0]);
                    return total + minutes;
                  }, 0)}m total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso do Tópico</h3>
            <span className="text-2xl font-bold text-primary">{topic.progress}%</span>
          </div>
          <Progress value={topic.progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {topic.lessons.filter(l => l.isCompleted).length} de {topic.lessons.length} aulas concluídas
          </p>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Aulas do Tópico</h2>
        <div className="space-y-4">
          {topic.lessons.map((lesson, index) => (
            <Card 
              key={lesson.id}
              className="group cursor-pointer bg-card border-netflix-gray hover:shadow-netflix transition-all duration-300 hover:border-primary/50"
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Lesson Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Lesson Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                      {lesson.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <Badge variant={lesson.isCompleted ? "default" : "secondary"} className="text-xs">
                        {lesson.isCompleted ? "Concluída" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
