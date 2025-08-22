import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Car, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
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
      toast.error('Failed to load cars')
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
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Car deleted successfully')
      fetchCars()
    } catch (error) {
      toast.error('Failed to delete car')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Collection</h1>
          <p className="text-gray-600">Manage your car inventory</p>
        </div>
        <Link
          to="/cars/new"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Car</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, make, or model..."
                className="input-field pr-10"
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
              className="input-field"
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
              className="btn-secondary flex items-center space-x-2 w-full"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {cars.length === 0 ? (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterMake ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first car.'}
          </p>
          {!searchTerm && !filterMake && (
            <div className="mt-6">
              <Link to="/cars/new" className="btn-primary">
                Add Car
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="card hover:shadow-lg transition-shadow">
              {car.image_url && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={car.image_url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {car.car_id}</p>
                  <p className="text-sm text-gray-500">Year: {car.year}</p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <Link
                    to={`/cars/${car.id}`}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/cars/${car.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteCar(car.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CarList
