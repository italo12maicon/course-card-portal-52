
-- =============================================
-- CRIAÇÃO DAS TABELAS
-- =============================================

-- Tabela de usuários (extende auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accessible_courses INTEGER[] DEFAULT '{}',
  ip_address INET,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cursos
CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  thumbnail TEXT NOT NULL,
  duration TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT false,
  has_access BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tópicos
CREATE TABLE public.topics (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de aulas
CREATE TABLE public.lessons (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de banners
CREATE TABLE public.banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  button_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE public.notifications (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'success')) DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  has_button BOOLEAN DEFAULT false,
  button_text TEXT,
  button_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de progresso do usuário
CREATE TABLE public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Tabela de sessões de login
CREATE TABLE public.login_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- =============================================
-- FUNÇÕES E TRIGGERS
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar usuário automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário após registro no auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para registrar login
CREATE OR REPLACE FUNCTION public.register_login(user_ip INET, user_agent_string TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Atualizar informações do usuário
  UPDATE users 
  SET 
    last_login = NOW(),
    login_count = login_count + 1,
    ip_address = user_ip
  WHERE id = auth.uid();
  
  -- Registrar sessão de login
  INSERT INTO login_sessions (user_id, ip_address, user_agent)
  VALUES (auth.uid(), user_ip, user_agent_string);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular progresso do tópico
CREATE OR REPLACE FUNCTION public.calculate_topic_progress(topic_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage INTEGER;
BEGIN
  -- Contar total de aulas do tópico
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE topic_id = topic_id_param;
  
  -- Contar aulas completadas pelo usuário
  SELECT COUNT(*) INTO completed_lessons
  FROM lessons l
  JOIN user_progress up ON l.id = up.lesson_id
  WHERE l.topic_id = topic_id_param 
    AND up.user_id = auth.uid()
    AND up.is_completed = true;
  
  -- Calcular percentual
  IF total_lessons = 0 THEN
    progress_percentage := 0;
  ELSE
    progress_percentage := ROUND((completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100);
  END IF;
  
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular progresso do curso
CREATE OR REPLACE FUNCTION public.calculate_course_progress(course_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage INTEGER;
BEGIN
  -- Contar total de aulas do curso
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  JOIN topics t ON l.topic_id = t.id
  WHERE t.course_id = course_id_param;
  
  -- Contar aulas completadas pelo usuário
  SELECT COUNT(*) INTO completed_lessons
  FROM lessons l
  JOIN topics t ON l.topic_id = t.id
  JOIN user_progress up ON l.id = up.lesson_id
  WHERE t.course_id = course_id_param 
    AND up.user_id = auth.uid()
    AND up.is_completed = true;
  
  -- Calcular percentual
  IF total_lessons = 0 THEN
    progress_percentage := 0;
  ELSE
    progress_percentage := ROUND((completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100);
  END IF;
  
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar aula como completa
CREATE OR REPLACE FUNCTION public.complete_lesson(lesson_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id, lesson_id, is_completed, completed_at)
  VALUES (auth.uid(), lesson_id_param, true, NOW())
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET 
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para courses
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para topics
CREATE POLICY "Anyone can view topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Admins can manage topics" ON topics FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para lessons
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage lessons" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para banners
CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all banners" ON banners FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para notifications
CREATE POLICY "Anyone can view active notifications" ON notifications FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage notifications" ON notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all progress" ON user_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para login_sessions
CREATE POLICY "Users can view own sessions" ON login_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all sessions" ON login_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- =============================================
-- DADOS INICIAIS (SEED DATA)
-- =============================================

-- Inserir cursos de exemplo
INSERT INTO courses (title, description, thumbnail, duration, category, is_free, rating, students) VALUES
('React Fundamentals', 'Complete course on React basics and advanced concepts', '/src/assets/react-course.jpg', '15h 30m', 'Frontend', true, 4.8, 1250),
('Node.js Backend Development', 'Build scalable backend applications with Node.js', '/src/assets/nodejs-course.jpg', '12h 45m', 'Backend', false, 4.7, 890),
('TypeScript Mastery', 'Master TypeScript for better JavaScript development', '/src/assets/typescript-course.jpg', '8h 20m', 'Language', false, 4.9, 750),
('Database Design', 'Learn database design principles and SQL', '/src/assets/database-course.jpg', '10h 15m', 'Database', false, 4.6, 650);

-- Inserir tópicos para o curso de React
INSERT INTO topics (course_id, title, description, thumbnail, order_index) VALUES
(1, 'Introduction to React', 'Learn the basics of React and component-based architecture', '/src/assets/react-course.jpg', 1),
(1, 'State Management', 'Understanding state and props in React applications', '/src/assets/react-course.jpg', 2),
(1, 'Hooks Deep Dive', 'Master React Hooks for modern development', '/src/assets/react-course.jpg', 3);

-- Inserir aulas para os tópicos
INSERT INTO lessons (topic_id, title, description, video_url, duration, order_index) VALUES
(1, 'What is React?', 'Introduction to React library and its benefits', 'https://example.com/video1', '15m', 1),
(1, 'Setting up Development Environment', 'Configure your environment for React development', 'https://example.com/video2', '20m', 2),
(1, 'Your First Component', 'Create your first React component', 'https://example.com/video3', '25m', 3),
(2, 'Understanding State', 'Learn about component state in React', 'https://example.com/video4', '18m', 1),
(2, 'Props and Data Flow', 'How data flows between components', 'https://example.com/video5', '22m', 2),
(3, 'useState Hook', 'Master the useState hook for state management', 'https://example.com/video6', '30m', 1),
(3, 'useEffect Hook', 'Handle side effects with useEffect', 'https://example.com/video7', '35m', 2);

-- Inserir banners de exemplo
INSERT INTO banners (title, description, image, link, button_text) VALUES
('Black Friday Sale', 'Get 50% off on all premium courses this week only!', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', '/courses', 'Ver Cursos'),
('New Course Available', 'Learn advanced React patterns with our new course', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop', '/courses/react-advanced', 'Começar Agora');

-- Inserir notificações de exemplo
INSERT INTO notifications (message, type, has_button, button_text, button_url) VALUES
('Welcome to our learning platform! Start your journey today.', 'success', true, 'Explore Courses', '/courses'),
('Maintenance scheduled for tonight 11 PM - 1 AM EST', 'warning', false, NULL, NULL);

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para cursos com progresso do usuário
CREATE OR REPLACE VIEW user_courses_with_progress AS
SELECT 
  c.*,
  COALESCE(calculate_course_progress(c.id), 0) as user_progress,
  CASE 
    WHEN c.id = ANY(u.accessible_courses) OR c.is_free = true THEN true
    ELSE false
  END as has_access
FROM courses c
CROSS JOIN users u
WHERE u.id = auth.uid();

-- View para tópicos com progresso
CREATE OR REPLACE VIEW user_topics_with_progress AS
SELECT 
  t.*,
  COALESCE(calculate_topic_progress(t.id), 0) as user_progress
FROM topics t;

-- View para estatísticas do admin
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
  (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE) as new_users_today,
  (SELECT COUNT(*) FROM courses) as total_courses,
  (SELECT COUNT(*) FROM lessons) as total_lessons,
  (SELECT COUNT(*) FROM login_sessions WHERE DATE(login_time) = CURRENT_DATE) as logins_today;

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_topics_course_id ON topics(course_id);
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_login_sessions_user_id ON login_sessions(user_id);
CREATE INDEX idx_login_sessions_login_time ON login_sessions(login_time);
CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_notifications_is_active ON notifications(is_active);

-- =============================================
-- CONFIGURAÇÕES DE SEGURANÇA
-- =============================================

-- Revogar permissões públicas desnecessárias
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Conceder permissões específicas
GRANT SELECT ON users TO authenticated;
GRANT SELECT ON courses TO authenticated, anon;
GRANT SELECT ON topics TO authenticated, anon;
GRANT SELECT ON lessons TO authenticated, anon;
GRANT SELECT ON banners TO authenticated, anon;
GRANT SELECT ON notifications TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT SELECT ON login_sessions TO authenticated;
GRANT SELECT ON user_courses_with_progress TO authenticated;
GRANT SELECT ON user_topics_with_progress TO authenticated;
GRANT SELECT ON admin_stats TO authenticated;

-- Conceder permissões de execução nas funções
GRANT EXECUTE ON FUNCTION register_login TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_topic_progress TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_course_progress TO authenticated;
GRANT EXECUTE ON FUNCTION complete_lesson TO authenticated;
