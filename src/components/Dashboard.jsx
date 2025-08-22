import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Car, Plus, List, TrendingUp, Calendar } from 'lucide-react'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vehicle Management Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Makes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.makes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recent Additions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentCars.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/cars/new"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add New Vehicle</p>
                    <p className="text-sm text-gray-500">Register a new car in your collection</p>
                  </div>
                </div>
                <Car className="h-5 w-5 text-gray-400" />
              </Link>
              
              <Link
                to="/cars"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <List className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View All Vehicles</p>
                    <p className="text-sm text-gray-500">Browse your complete collection</p>
                  </div>
                </div>
                <Car className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Recent Vehicles */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Vehicles</h2>
            {stats.recentCars.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCars.map(car => (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Car className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{car.make} {car.model}</p>
                        <p className="text-sm text-gray-500">{car.year} • {car.car_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(car.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No vehicles added yet</p>
                <p className="text-sm text-gray-400 mt-1">Start by adding your first vehicle</p>
              </div>
            )}
          </div>
        </div>

        {/* Makes Overview */}
        {stats.makes.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Makes</h2>
            <div className="flex flex-wrap gap-3">
              {stats.makes.map(make => (
                <span
                  key={make}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {make}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
