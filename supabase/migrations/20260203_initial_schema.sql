-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lawyers table
CREATE TABLE IF NOT EXISTS public.lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bar_number TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_cases INTEGER DEFAULT 0,
  bio TEXT,
  profile_image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date DATE,
  location TEXT,
  viability_score INTEGER CHECK (viability_score >= 0 AND viability_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'matched', 'closed')),
  documents JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'accepted', 'rejected')),
  contacted_at TIMESTAMP WITH TIME ZONE,
  response_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(claim_id, lawyer_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_lawyers_city ON public.lawyers(city);
CREATE INDEX IF NOT EXISTS idx_lawyers_state ON public.lawyers(state);
CREATE INDEX IF NOT EXISTS idx_lawyers_is_active ON public.lawyers(is_active);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_leads_claim_id ON public.leads(claim_id);
CREATE INDEX IF NOT EXISTS idx_leads_lawyer_id ON public.leads(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for lawyers table
CREATE POLICY "Anyone can view active verified lawyers" ON public.lawyers
  FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Lawyers can update their own profile" ON public.lawyers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for claims table
CREATE POLICY "Users can view their own claims" ON public.claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims" ON public.claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims" ON public.claims
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for leads table
CREATE POLICY "Lawyers can view their leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lawyers
      WHERE lawyers.id = leads.lawyer_id
      AND lawyers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view leads for their claims" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.claims
      WHERE claims.id = leads.claim_id
      AND claims.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.lawyers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
