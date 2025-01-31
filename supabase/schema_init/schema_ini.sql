/*
  # Initial Schema Setup for Event Booking System

  1. New Tables
    - events
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - date (timestamptz)
      - capacity (integer)
      - price (decimal)
      - created_at (timestamptz)
      - created_by (uuid, references auth.users)
    
    - bookings
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - user_id (uuid, references auth.users)
      - quantity (integer)
      - total_price (decimal)
      - status (text)
      - created_at (timestamptz)
      
    - profiles
      - id (uuid, primary key, references auth.users)
      - full_name (text)
      - phone (text)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

/*
-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  price decimal NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_price decimal NOT NULL CHECK (total_price >= 0),
  status text NOT NULL CHECK (status IN ('confirmed', 'cancelled')) DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  phone text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Events can be created by authenticated users"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Events can be updated by their creators"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Events can be deleted by their creators"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/