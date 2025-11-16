-- Create a trigger to restrict admin role to specific emails
CREATE OR REPLACE FUNCTION public.check_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Only check for admin role
  IF NEW.role = 'admin' THEN
    -- Get the user's email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Check if email is in allowed list
    IF user_email NOT IN ('sathwiksastryr@gmail.com', 'kishanbharadwaj2010@gmail.com') THEN
      RAISE EXCEPTION 'Admin access is restricted to authorized emails only';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on user_roles table
DROP TRIGGER IF EXISTS check_admin_email_trigger ON public.user_roles;
CREATE TRIGGER check_admin_email_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_admin_email();