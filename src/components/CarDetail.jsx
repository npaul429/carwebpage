import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Edit, Trash2, Calendar, Hash, Download, Github } from 'lucide-react'
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

  const exportToJSON = () => {
    if (!car) return

    const carData = {
      car_id: car.car_id,
      make: car.make,
      model: car.model,
      year: car.year,
      image_url: car.image_url,
      created_at: car.created_at,
      updated_at: car.updated_at
    }

    const dataStr = JSON.stringify(carData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${car.car_id}_${car.make}_${car.model}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Car data exported successfully')
  }

  const exportToGitHub = async () => {
    const githubToken = import.meta.env.VITE_GITHUB_TOKEN
    
    if (!githubToken) {
      toast.error('GitHub token not configured. Please add VITE_GITHUB_TOKEN to your .env file.')
      return
    }

    if (!car) return

    try {
      const carData = {
        car_id: car.car_id,
        make: car.make,
        model: car.model,
        year: car.year,
        image_url: car.image_url,
        created_at: car.created_at,
        updated_at: car.updated_at
      }

      const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/cars/' + car.car_id + '.json', {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add car: ${car.make} ${car.model} (${car.year})`,
          content: btoa(JSON.stringify(carData, null, 2))
        })
      })

      if (response.ok) {
        toast.success('Car data exported to GitHub successfully')
      } else {
        throw new Error('Failed to export to GitHub')
      }
    } catch (error) {
      toast.error('Failed to export to GitHub')
      console.error('Error exporting to GitHub:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/cars')}
            className="btn-primary"
          >
            Back to Cars
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image */}
        <div>
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {car.make} {car.model}
            </h1>
            <p className="text-lg text-gray-600">Car ID: {car.car_id}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Year: {car.year}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">ID: {car.car_id}</span>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/cars/${car.id}/edit`)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Car</span>
              </button>
              
              <button
                onClick={exportToJSON}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
              
              <button
                onClick={exportToGitHub}
                className="btn-secondary flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Export to GitHub</span>
              </button>
              
              <button
                onClick={deleteCar}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Car</span>
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Created: {new Date(car.created_at).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(car.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
