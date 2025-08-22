import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import AuthCallback from './components/AuthCallback'
import Dashboard from './components/Dashboard'
import CarForm from './components/CarForm'
import CarList from './components/CarList'
import CarDetail from './components/CarDetail'
import Header from './components/Header'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <PrivateRoute>
                <div>
                  <Header />
                  <Dashboard />
                </div>
              </PrivateRoute>
            } />
            <Route path="/cars" element={
              <PrivateRoute>
                <div>
                  <Header />
                  <CarList />
                </div>
              </PrivateRoute>
            } />
            <Route path="/cars/new" element={
              <PrivateRoute>
                <div>
                  <Header />
                  <CarForm />
                </div>
              </PrivateRoute>
            } />
            <Route path="/cars/:id" element={
              <PrivateRoute>
                <div>
                  <Header />
                  <CarDetail />
                </div>
              </PrivateRoute>
            } />
            <Route path="/cars/:id/edit" element={
              <PrivateRoute>
                <div>
                  <Header />
                  <CarForm />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
