"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Your Fridge Photo</h2>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 transition-all duration-300 ease-in-out hover:border-teal-500">
        {image ? (
          <div className="relative w-full max-w-md">
            <img
              src={image || "/placeholder.svg"}
              alt="Uploaded fridge"
              className="w-full h-auto rounded-lg shadow-md"
            />
            <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              Remove
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <span className="text-lg text-gray-600 mb-2">Drag and drop your image here</span>
            <span className="text-sm text-gray-500">or click to select a file</span>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        )}
      </div>
    </div>
  )
}

