import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Edit, Trash2, Calendar, Hash, Car } from 'lucide-react'
import toast from 'react-hot-toast'

const CarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setCar(data)
    } catch (error) {
      toast.error('Failed to load car details')
      console.error('Error fetching car:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCar = async () => {
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
      navigate('/cars')
    } catch (error) {
      toast.error('Failed to delete car')
      console.error('Error deleting car:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/cars')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Cars
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {car.make} {car.model}
              </h1>
              <p className="text-gray-600 mt-1">Vehicle Details</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/cars/${car.id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={deleteCar}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Car Image */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {car.image_url ? (
              <img
                src={car.image_url}
                alt={`${car.make} ${car.model}`}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Car Information */}
          <div className="space-y-8">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Car ID</span>
                  </div>
                  <span className="font-medium text-gray-900">{car.car_id}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Make</span>
                  </div>
                  <span className="font-medium text-gray-900">{car.make}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Model</span>
                  </div>
                  <span className="font-medium text-gray-900">{car.model}</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Year</span>
                  </div>
                  <span className="font-medium text-gray-900">{car.year}</span>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Record Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">{new Date(car.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">{new Date(car.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
