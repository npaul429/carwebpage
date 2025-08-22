import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Car, Plus, Search, Filter, Edit, Trash2, Eye, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const CarList = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMake, setFilterMake] = useState('')
  const [makes, setMakes] = useState([])

  useEffect(() => {
    fetchCars()
    fetchMakes()
  }, [])

  const fetchCars = async () => {
    try {
      let query = supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(`car_id.ilike.%${searchTerm}%,make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`)
      }

      if (filterMake) {
        query = query.eq('make', filterMake)
      }

      const { data, error } = await query

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      toast.error('Failed to load vehicles')
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMakes = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('make')
        .order('make')

      if (error) throw error

      const uniqueMakes = [...new Set(data?.map(car => car.make) || [])]
      setMakes(uniqueMakes)
    } catch (error) {
      console.error('Error fetching makes:', error)
    }
  }

  const deleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Vehicle deleted successfully')
      fetchCars()
    } catch (error) {
      toast.error('Failed to delete vehicle')
      console.error('Error deleting car:', error)
    }
  }

  const handleSearch = () => {
    fetchCars()
  }

  const handleFilter = () => {
    fetchCars()
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
            <p className="text-gray-600 mt-1">Manage your vehicle collection</p>
          </div>
          <Link
            to="/cars/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Vehicles
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID, make, or model..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Make
              </label>
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Makes</option>
                {makes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Apply Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterMake ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first vehicle.'}
            </p>
            {!searchTerm && !filterMake && (
              <Link 
                to="/cars/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Vehicle</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                {car.image_url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={car.image_url}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {car.car_id}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{car.year}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Link
                        to={`/cars/${car.id}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">View</span>
                      </Link>
                      
                      <div className="flex space-x-3">
                        <Link
                          to={`/cars/${car.id}/edit`}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          title="Edit vehicle"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete vehicle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CarList
