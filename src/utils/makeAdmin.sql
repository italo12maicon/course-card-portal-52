
-- Script para tornar o usuário específico um administrador
-- Execute este SQL no Supabase SQL Editor

UPDATE public.users 
SET is_admin = true 
WHERE id = '9c7c59e5-3e40-4233-8141-77d57deae091';

-- Verificar se a atualização foi bem-sucedida
SELECT id, name, email, is_admin 
FROM public.users 
WHERE id = '9c7c59e5-3e40-4233-8141-77d57deae091';
