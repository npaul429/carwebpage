# 🚗 Car Details App - Complete Beginner Setup Guide

This guide will walk you through setting up the Car Details App from scratch, even if you've never used these tools before.

## 📋 What You'll Need

Before we start, make sure you have:
- A computer with internet access
- A web browser (Chrome, Firefox, Safari, or Edge)
- Basic computer skills (downloading files, copying/pasting text)

## 🎯 What We're Building

A web application where you can:
- Log in with your Google account
- Add cars to your collection (with photos)
- View, edit, and delete your cars
- Search and filter your car collection
- Export your car data

---

## Step 1: Install Node.js (5 minutes)

### What is Node.js?
Node.js is a program that lets your computer run JavaScript applications.

### How to install:
1. **Go to** [nodejs.org](https://nodejs.org)
2. **Click** the big green "LTS" button (it says something like "20.x.x LTS")
3. **Download** the file for your computer (Windows, Mac, or Linux)
4. **Run** the downloaded file and follow the installation wizard
5. **Restart** your computer

### Check if it worked:
1. **Open** Command Prompt (Windows) or Terminal (Mac/Linux)
2. **Type**: `node --version`
3. **Press Enter**
4. You should see something like `v20.x.x` - this means it worked!

---

## Step 2: Download and Set Up the Project (5 minutes)

### Download the project:
1. **Download** all the project files to your computer
2. **Create a new folder** on your desktop called "car-app"
3. **Copy all the project files** into this folder

### Open the project:
1. **Open** Command Prompt (Windows) or Terminal (Mac/Linux)
2. **Navigate** to your project folder:
   - Windows: `cd Desktop\car-app`
   - Mac/Linux: `cd Desktop/car-app`
3. **Type**: `npm install`
4. **Press Enter** and wait (this might take a few minutes)

---

## Step 3: Create a Supabase Account (10 minutes)

### What is Supabase?
Supabase is like a free database service that will store all your car information.

### Create account:
1. **Go to** [supabase.com](https://supabase.com)
2. **Click** "Start your project" or "Sign Up"
3. **Sign up** with your email or GitHub account
4. **Verify** your email if needed

### Create a new project:
1. **Click** "New Project"
2. **Choose** your organization (or create one)
3. **Enter** a project name: "car-details-app"
4. **Enter** a database password (write this down!)
5. **Choose** a region close to you
6. **Click** "Create new project"
7. **Wait** for it to finish (this takes 2-3 minutes)

---

## Step 4: Get Your Supabase Keys (5 minutes)

### Find your project URL and keys:
1. **In your Supabase dashboard**, click on your project
2. **Click** "Settings" in the left sidebar
3. **Click** "API" in the settings menu
4. **Copy** these two things:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Write these down - you'll need them in Step 6!

---

## Step 5: Set Up the Database (10 minutes)

### Create the cars table:
1. **In your Supabase dashboard**, click "SQL Editor" in the left sidebar
2. **Click** "New query"
3. **Copy and paste** this entire code block:

```sql
-- Create cars table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_car_id ON cars(car_id);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies for user data isolation
CREATE POLICY "Users can view own cars" ON cars
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cars" ON cars
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cars" ON cars
  FOR DELETE USING (auth.uid() = user_id);
```

4. **Click** "Run" button
5. **You should see** "Success. No rows returned" - this means it worked!

### Set up image storage:
1. **Click** "Storage" in the left sidebar
2. **Click** "New bucket"
3. **Enter** bucket name: `car-images`
4. **Make sure** "Public bucket" is checked
5. **Click** "Create bucket"
6. **Click** on the `car-images` bucket
7. **Click** "Policies" tab
8. **Click** "New Policy"
9. **Copy and paste** this code:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'car-images');

-- Allow authenticated users to view images
CREATE POLICY "Authenticated users can view images" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated' AND bucket_id = 'car-images');
```

10. **Click** "Review" then "Save policy"

---

## Step 6: Set Up Google OAuth (15 minutes)

### What is Google OAuth?
This lets users log in with their Google account instead of creating a new password.

### Create Google Cloud Project:
1. **Go to** [console.cloud.google.com](https://console.cloud.google.com)
2. **Click** "Select a project" at the top
3. **Click** "New Project"
4. **Enter** project name: "car-details-app"
5. **Click** "Create"
6. **Wait** for it to finish, then click "Select"

### Enable Google+ API:
1. **Click** the menu (☰) in the top left
2. **Go to** "APIs & Services" > "Library"
3. **Search** for "Google+ API"
4. **Click** on "Google+ API"
5. **Click** "Enable"

### Create OAuth credentials:
1. **Go to** "APIs & Services" > "Credentials"
2. **Click** "Create Credentials" > "OAuth 2.0 Client IDs"
3. **If asked**, configure the OAuth consent screen:
   - **User Type**: External
   - **App name**: "Car Details App"
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **Save and Continue** through all steps
4. **Back to credentials**, click "Create Credentials" > "OAuth 2.0 Client IDs"
5. **Application type**: Web application
6. **Name**: "Car Details App Web Client"
7. **Authorized redirect URIs**: Add these two:
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
   (Replace `YOUR_PROJECT_ID` with your actual Supabase project ID)
8. **Click** "Create"
9. **Copy** the Client ID and Client Secret (you'll need these!)

### Configure Supabase with Google:
1. **Go back** to your Supabase dashboard
2. **Click** "Authentication" > "Providers"
3. **Find** "Google" and click the toggle to enable it
4. **Enter** your Google Client ID and Client Secret
5. **Click** "Save"

---

## Step 7: Create Environment File (5 minutes)

### Create the .env file:
1. **In your project folder**, create a new file called `.env`
2. **Open** the file in any text editor (Notepad, TextEdit, VS Code)
3. **Copy and paste** this template:

```env
# Supabase Configuration
VITE_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
VITE_SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=1067470493660-9eav3rm9jdr6li2621ll8aa1pvor5qbn.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# GitHub Export Configuration (Optional)
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

### Replace the placeholders:
- **YOUR_SUPABASE_URL_HERE**: Your Supabase project URL from Step 4
- **YOUR_SUPABASE_ANON_KEY_HERE**: Your Supabase anon key from Step 4
- **YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE**: Your Supabase service role key from Step 4
- **YOUR_GOOGLE_CLIENT_SECRET_HERE**: Your Google Client Secret from Step 6

### Example of what it should look like:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=1067470493660-9eav3rm9jdr6li2621ll8aa1pvor5qbn.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# GitHub Export Configuration (Optional)
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

---

## Step 8: Run the Application (2 minutes)

### Start the app:
1. **Open** Command Prompt/Terminal
2. **Navigate** to your project folder
3. **Type**: `npm run dev`
4. **Press Enter**
5. **Wait** for it to start (you'll see some text appear)
6. **Open** your web browser
7. **Go to**: `http://localhost:3000`

### What should happen:
- You should see a login page
- Click "Sign in with Google"
- You'll be redirected to Google to log in
- After logging in, you'll see the dashboard

---

## Step 9: Test the Application (5 minutes)

### Try adding a car:
1. **Click** "Add Car" button
2. **Fill in** the form:
   - Car ID: `test-car-001`
   - Make: `Toyota`
   - Model: `Camry`
   - Year: `2023`
3. **Optionally** upload a car image
4. **Click** "Add Car"
5. **You should see** the car appear in your list!

### Try other features:
- **Search** for cars using the search bar
- **Filter** by make using the dropdown
- **Click** on a car to view details
- **Edit** a car by clicking the edit button
- **Delete** a car by clicking the delete button

---

## 🎉 Congratulations!

You've successfully set up and are running your own car details web application! 

### What you can do now:
- Add cars to your collection
- Upload photos of your cars
- Search and filter your cars
- Export your car data
- Share the app with others

### Next steps:
- Add more cars to your collection
- Customize the app (change colors, add features)
- Deploy it to the internet so others can use it

---

## 🆘 Troubleshooting

### If the app won't start:
- Make sure Node.js is installed: `node --version`
- Make sure you're in the right folder
- Try running `npm install` again

### If login doesn't work:
- Check your Google OAuth configuration
- Make sure redirect URIs are correct
- Check your Supabase authentication settings

### If you can't add cars:
- Check your Supabase database setup
- Make sure the SQL commands ran successfully
- Check your environment variables

### If images won't upload:
- Check your Supabase storage bucket setup
- Make sure storage policies are configured
- Check file size (must be under 5MB)

---

## 📞 Need Help?

If you get stuck at any step:
1. **Double-check** all the steps above
2. **Make sure** all URLs and keys are copied correctly
3. **Check** that you're in the right folders
4. **Restart** your computer if needed
5. **Ask for help** - there are many online communities that can assist!

Good luck, and enjoy your new car details app! 🚗✨
