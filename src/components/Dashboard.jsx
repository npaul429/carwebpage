import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Car, Plus, List, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCars: 0,
    recentCars: [],
    makes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Get total cars count
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })

      // Get recent cars
      const { data: recentCars } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Get unique makes
      const { data: makes } = await supabase
        .from('cars')
        .select('make')
        .order('make')

      const uniqueMakes = [...new Set(makes?.map(car => car.make) || [])]

      setStats({
        totalCars: totalCars || 0,
        recentCars: recentCars || [],
        makes: uniqueMakes
      })
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your car collection.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cars</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCars}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Makes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.makes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <List className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Additions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.recentCars.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/cars/new"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Car</span>
            </Link>
            <Link
              to="/cars"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <List className="h-4 w-4" />
              <span>View All Cars</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Cars</h3>
          {stats.recentCars.length > 0 ? (
            <div className="space-y-3">
              {stats.recentCars.map(car => (
                <Link
                  key={car.id}
                  to={`/cars/${car.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{car.make} {car.model}</p>
                    <p className="text-sm text-gray-500">{car.year}</p>
                  </div>
                  <Car className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No cars added yet. Start by adding your first car!</p>
          )}
        </div>
      </div>

      {/* Makes Overview */}
      {stats.makes.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Car Makes in Collection</h3>
          <div className="flex flex-wrap gap-2">
            {stats.makes.map(make => (
              <span
                key={make}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {make}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
