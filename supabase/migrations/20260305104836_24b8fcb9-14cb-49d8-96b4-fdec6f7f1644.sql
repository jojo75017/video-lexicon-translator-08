
-- Forum categories
CREATE TABLE public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  emoji text DEFAULT '💬',
  color text DEFAULT 'blue',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Anyone can view forum categories" ON public.forum_categories
  FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage forum categories" ON public.forum_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default categories
INSERT INTO public.forum_categories (name, slug, description, emoji, color, sort_order) VALUES
  ('KDP & Publication', 'kdp-publication', 'Tout sur Amazon KDP, la publication et les ventes', '📚', 'blue', 1),
  ('Écriture & IA', 'ecriture-ia', 'Astuces d''écriture avec l''intelligence artificielle', '🤖', 'purple', 2),
  ('Marketing & Ventes', 'marketing-ventes', 'Stratégies pour vendre plus de livres', '📈', 'green', 3),
  ('Résultats & Succès', 'resultats-succes', 'Partagez vos résultats et célébrez vos succès !', '🏆', 'amber', 4),
  ('Questions & Aide', 'questions-aide', 'Posez vos questions à la communauté', '❓', 'red', 5);

-- Forum posts
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.forum_categories(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL DEFAULT 'Membre',
  author_avatar_url text,
  title text NOT NULL,
  content text NOT NULL,
  post_type text NOT NULL DEFAULT 'discussion',
  likes_count integer NOT NULL DEFAULT 0,
  replies_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts
  FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts" ON public.forum_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Users can delete their own posts, admins can delete any
CREATE POLICY "Users can delete their own posts" ON public.forum_posts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Forum replies
CREATE TABLE public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL DEFAULT 'Membre',
  author_avatar_url text,
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum replies" ON public.forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON public.forum_replies
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON public.forum_replies
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own replies" ON public.forum_replies
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Forum likes (unique per user per post/reply)
CREATE TABLE public.forum_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id),
  CHECK (post_id IS NOT NULL OR reply_id IS NOT NULL)
);

ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.forum_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON public.forum_likes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" ON public.forum_likes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Forum notifications
CREATE TABLE public.forum_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'reply',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.forum_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service can create notifications" ON public.forum_notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.forum_notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to increment replies_count on forum_posts
CREATE OR REPLACE FUNCTION public.increment_reply_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE forum_posts SET replies_count = replies_count + 1, updated_at = now() WHERE id = NEW.post_id;
  -- Create notification for the post author
  INSERT INTO forum_notifications (user_id, post_id, reply_id, type, message)
  SELECT fp.user_id, NEW.post_id, NEW.id, 'reply', NEW.author_name || ' a répondu à votre discussion'
  FROM forum_posts fp WHERE fp.id = NEW.post_id AND fp.user_id != NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reply_created
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.increment_reply_count();

-- Trigger to decrement replies_count on delete
CREATE OR REPLACE FUNCTION public.decrement_reply_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE forum_posts SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_reply_deleted
  AFTER DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.decrement_reply_count();

-- Trigger for like count on posts
CREATE OR REPLACE FUNCTION public.update_post_like_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE forum_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    -- Notify post author
    INSERT INTO forum_notifications (user_id, post_id, type, message)
    SELECT fp.user_id, NEW.post_id, 'like', 'Quelqu''un a aimé votre discussion'
    FROM forum_posts fp WHERE fp.id = NEW.post_id AND fp.user_id != NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE forum_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.forum_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_like_count();

-- Enable realtime for posts and replies
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_notifications;
