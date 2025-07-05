
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Lock, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Course, Topic } from "@/types";
import { LessonViewer } from "./LessonViewer";

interface CourseTopicsProps {
  course: Course;
  onBack: () => void;
}

export function CourseTopics({ course, onBack }: CourseTopicsProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  if (selectedTopic) {
    return (
      <LessonViewer
        topic={selectedTopic}
        courseName={course.title}
        onBack={() => setSelectedTopic(null)}
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
          Voltar aos Cursos
        </Button>
      </div>

      {/* Course Header */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-end p-8">
          <div className="space-y-4">
            <Badge className="bg-primary text-primary-foreground w-fit">
              {course.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {course.description}
            </p>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.topics.length} tópicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso do Curso</h3>
            <span className="text-2xl font-bold text-primary">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Continue assistindo para completar o curso
          </p>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tópicos do Curso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.topics.map((topic, index) => (
            <Card 
              key={topic.id} 
              className="group cursor-pointer bg-card border-netflix-gray hover:shadow-netflix transition-all duration-300 hover:scale-105 overflow-hidden"
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={topic.thumbnail}
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/90 text-primary-foreground rounded-full p-4 shadow-glow">
                    <Play className="h-6 w-6" />
                  </div>
                </div>
                
                {/* Topic Number */}
                <div className="absolute top-4 left-4 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Progress Badge */}
                <div className="absolute top-4 right-4">
                  {topic.progress === 100 ? (
                    <div className="bg-green-600 text-white rounded-full p-2">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  ) : topic.progress > 0 ? (
                    <div className="bg-yellow-600 text-white rounded-full px-3 py-1 text-xs font-medium">
                      {topic.progress}%
                    </div>
                  ) : (
                    <div className="bg-gray-600 text-white rounded-full p-2">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Lessons Count */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full px-3 py-1 text-sm">
                  {topic.lessons.length} aulas
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {topic.description}
                  </p>
                  
                  {topic.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="text-foreground font-medium">{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
