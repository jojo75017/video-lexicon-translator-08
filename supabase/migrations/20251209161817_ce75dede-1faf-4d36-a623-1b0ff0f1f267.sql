-- Table pour les livres publiés
CREATE TABLE public.published_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT,
  asin TEXT,
  isbn TEXT,
  publication_date DATE,
  price DECIMAL(10,2) DEFAULT 0,
  pages INTEGER DEFAULT 0,
  category TEXT,
  keywords TEXT[],
  cover_url TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'historique BSR et ventes
CREATE TABLE public.book_tracking_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.published_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  bsr INTEGER,
  estimated_daily_sales DECIMAL(10,2),
  estimated_monthly_sales DECIMAL(10,2),
  estimated_monthly_revenue DECIMAL(10,2),
  reviews_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.published_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tracking_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for published_books
CREATE POLICY "Users can view their own books" ON public.published_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own books" ON public.published_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" ON public.published_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" ON public.published_books
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for book_tracking_history
CREATE POLICY "Users can view their own tracking data" ON public.book_tracking_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tracking data" ON public.book_tracking_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracking data" ON public.book_tracking_history
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_published_books_updated_at
  BEFORE UPDATE ON public.published_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_book_tracking_book_id ON public.book_tracking_history(book_id);
CREATE INDEX idx_book_tracking_tracked_at ON public.book_tracking_history(tracked_at);
CREATE INDEX idx_published_books_user_id ON public.published_books(user_id);