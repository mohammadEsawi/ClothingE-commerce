import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedImage {
  file: File
  preview: string
  isPrimary: boolean
}

interface ImageUploaderProps {
  onChange: (files: File[], primaryIndex: number) => void
  maxFiles?: number
}

export function ImageUploader({ onChange, maxFiles = 10 }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && i === 0
      }))
      const updated = [...images, ...newImages].slice(0, maxFiles)
      setImages(updated)
      const primaryIdx = updated.findIndex((img) => img.isPrimary)
      onChange(
        updated.map((img) => img.file),
        primaryIdx >= 0 ? primaryIdx : 0
      )
    },
    [images, maxFiles, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles
  })

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true
    }
    setImages(updated)
    const primaryIdx = updated.findIndex((img) => img.isPrimary)
    onChange(
      updated.map((img) => img.file),
      primaryIdx >= 0 ? primaryIdx : 0
    )
  }

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    setImages(updated)
    onChange(
      updated.map((img) => img.file),
      index
    )
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive ? 'Drop images here' : 'Drop images or click to upload'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, WEBP up to 5MB (max {maxFiles} files)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                'relative group rounded-lg overflow-hidden border-2 cursor-pointer aspect-square',
                img.isPrimary ? 'border-primary-500' : 'border-transparent'
              )}
              onClick={() => setPrimary(i)}
            >
              <img
                src={img.preview}
                alt=""
                className="h-full w-full object-cover"
              />
              {img.isPrimary && (
                <div className="absolute top-1 start-1 bg-primary-600 text-white text-[10px] px-1 rounded">
                  Primary
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                className="absolute top-1 end-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
