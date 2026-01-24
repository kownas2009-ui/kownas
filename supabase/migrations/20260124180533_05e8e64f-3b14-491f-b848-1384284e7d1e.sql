-- FK z bookings do profiles (dla joinów)
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_user_id_profiles_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(user_id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);

-- Tabela notatek od admina do uczniów
CREATE TABLE public.student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL,
  created_by_user_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT student_notes_title_len CHECK (char_length(title) <= 120),
  CONSTRAINT student_notes_body_len CHECK (char_length(body) <= 5000)
);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

-- FK do profiles (student)
ALTER TABLE public.student_notes
  ADD CONSTRAINT student_notes_student_user_id_fkey
  FOREIGN KEY (student_user_id)
  REFERENCES public.profiles(user_id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

-- FK do profiles (admin who created)
ALTER TABLE public.student_notes
  ADD CONSTRAINT student_notes_created_by_user_id_fkey
  FOREIGN KEY (created_by_user_id)
  REFERENCES public.profiles(user_id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_student_notes_student_user_id ON public.student_notes(student_user_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_created_at ON public.student_notes(created_at DESC);

-- Trigger dla updated_at
CREATE TRIGGER update_student_notes_updated_at
BEFORE UPDATE ON public.student_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
CREATE POLICY "Students can view their own notes"
ON public.student_notes
FOR SELECT
USING (auth.uid() = student_user_id);

CREATE POLICY "Admins can view all notes"
ON public.student_notes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create notes"
ON public.student_notes
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND created_by_user_id = auth.uid()
);

CREATE POLICY "Admins can update notes"
ON public.student_notes
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notes"
ON public.student_notes
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));