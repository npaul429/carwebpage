import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for cars table
export const createCarsTable = async () => {
  const { error } = await supabase.rpc('create_cars_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS cars (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        car_id VARCHAR(50) UNIQUE NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        image_url TEXT,
        user_id UUID REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create index for faster queries
      CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
      CREATE INDEX IF NOT EXISTS idx_cars_car_id ON cars(car_id);
      
      -- Enable Row Level Security
      ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for users to see only their own cars
      CREATE POLICY "Users can view own cars" ON cars
        FOR SELECT USING (auth.uid() = user_id);
      
      -- Create policy for users to insert their own cars
      CREATE POLICY "Users can insert own cars" ON cars
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      -- Create policy for users to update their own cars
      CREATE POLICY "Users can update own cars" ON cars
        FOR UPDATE USING (auth.uid() = user_id);
      
      -- Create policy for users to delete their own cars
      CREATE POLICY "Users can delete own cars" ON cars
        FOR DELETE USING (auth.uid() = user_id);
    `
  })
  
  if (error) {
    console.error('Error creating cars table:', error)
  }
}
