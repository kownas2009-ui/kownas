-- Create a trigger function to auto-assign admin role to Aneta
CREATE OR REPLACE FUNCTION public.assign_admin_to_aneta()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user's email is Aneta's email, update their role to admin
  IF NEW.email = 'a.kownacka@gmail.com' THEN
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger that fires after a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_admin_to_aneta();