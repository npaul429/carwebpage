# 🚗 Car Details Manager

A modern React application for managing your car collection with authentication, CRUD operations, and a beautiful UI.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide React icons
- 📊 **Dashboard** - Overview of your car collection
- ➕ **Add Cars** - Easy form to add new cars to your collection
- 📝 **Edit Cars** - Update car details anytime
- 👁️ **View Details** - Detailed view of each car
- 🗑️ **Delete Cars** - Remove cars from your collection
- 🔄 **Real-time Updates** - Instant updates with Supabase
- 📱 **Mobile Friendly** - Optimized for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/npaul429/carwebpage.git
   cd carwebpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your URL and anon key
   - Enable Google OAuth in Authentication → Providers
   - Set up your database schema (see setup guide below)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` or `http://localhost:3001`
   
   **For mobile access:**
   - Desktop IP: `http://10.1.10.21:3001`
   - Mobile IP: `http://10.1.10.201:3001`

## 📋 Database Setup

The app uses Supabase with the following schema:

```sql
CREATE TABLE cars (
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
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/v1/callback` (for development)
6. Configure in Supabase Dashboard → Authentication → Providers → Google

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CarDetail.jsx   # Individual car view
│   ├── CarForm.jsx     # Add/edit car form
│   ├── CarList.jsx     # List of all cars
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Header.jsx      # Navigation header
│   └── Login.jsx       # Login page
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── lib/               # Utility libraries
│   └── supabase.js    # Supabase client
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Lucide React](https://lucide.dev) for the beautiful icons
- [React Hook Form](https://react-hook-form.com) for form handling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by [Your Name]
