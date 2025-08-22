import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Upload, Save, Loader, Car } from 'lucide-react'
import toast from 'react-hot-toast'

const CarForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const isEditing = Boolean(id)

  useEffect(() => {
    if (isEditing) {
      fetchCar()
    }
  }, [id])

  const fetchCar = async () => {
    try {
      const { data: car, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (car) {
        setValue('car_id', car.car_id)
        setValue('make', car.make)
        setValue('model', car.model)
        setValue('year', car.year)
        setImageUrl(car.image_url || '')
      }
    } catch (error) {
      toast.error('Failed to load vehicle details')
      console.error('Error fetching car:', error)
    }
  }

  const uploadImage = async (file) => {
    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      const carData = {
        car_id: data.car_id,
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        image_url: imageUrl,
        user_id: user.id
      }

      let result
      if (isEditing) {
        result = await supabase
          .from('cars')
          .update(carData)
          .eq('id', id)
      } else {
        result = await supabase
          .from('cars')
          .insert([carData])
      }

      if (result.error) throw result.error

      toast.success(isEditing ? 'Vehicle updated successfully' : 'Vehicle added successfully')
      navigate('/cars')
    } catch (error) {
      toast.error(isEditing ? 'Failed to update vehicle' : 'Failed to add vehicle')
      console.error('Error saving car:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG and PNG images are allowed')
        return
      }
      
      uploadImage(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Update vehicle information' : 'Register a new vehicle in your collection'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vehicle ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle ID *
              </label>
              <input
                type="text"
                {...register('car_id', { 
                  required: 'Vehicle ID is required',
                  pattern: {
                    value: /^[A-Za-z0-9-_]+$/,
                    message: 'Vehicle ID can only contain letters, numbers, hyphens, and underscores'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter unique vehicle ID"
              />
              {errors.car_id && (
                <p className="mt-1 text-sm text-red-600">{errors.car_id.message}</p>
              )}
            </div>

            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                {...register('make', { 
                  required: 'Make is required',
                  minLength: {
                    value: 2,
                    message: 'Make must be at least 2 characters'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota, Ford, BMW"
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                {...register('model', { 
                  required: 'Model is required',
                  minLength: {
                    value: 1,
                    message: 'Model must be at least 1 character'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Camry, Mustang, X5"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                {...register('year', { 
                  required: 'Year is required',
                  min: {
                    value: 1900,
                    message: 'Year must be at least 1900'
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Year cannot be later than ${new Date().getFullYear() + 1}`
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2023"
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Image
              </label>
              <div className="space-y-4">
                {imageUrl && (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Vehicle preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                <span>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CarForm
