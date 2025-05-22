"use client"

import React, { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, Film, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { BUCKET_IMAGES, BUCKET_VIDEOS, BUCKET_EVENTS, BUCKET_ARTISTS } from "@/lib/supabase/storage"

interface FileUploaderProps {
  onFileUploaded: (url: string) => void
  currentFileUrl?: string
  acceptedFileTypes?: string
  maxSizeMB?: number
  bucket?: string
  folder?: string
  className?: string
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
}

export function FileUploader({
  onFileUploaded,
  currentFileUrl = "",
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
  bucket = BUCKET_IMAGES,
  folder = "",
  className,
  variant = "outline"
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(currentFileUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSizeBytes = maxSizeMB * 1024 * 1024 // Converter MB para bytes

  const isVideo = acceptedFileTypes.includes("video/")
  const isImage = acceptedFileTypes.includes("image/") || acceptedFileTypes === "image/*"

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo
    if (file.size > maxSizeBytes) {
      setUploadError(`O arquivo é muito grande. O tamanho máximo é ${maxSizeMB}MB.`)
      setErrorCode("FILE_TOO_LARGE")
      return
    }

    // Validar tipo de arquivo
    if (acceptedFileTypes !== "*" && !file.type.match(acceptedFileTypes)) {
      setUploadError(`Tipo de arquivo não suportado. Tipos aceitos: ${acceptedFileTypes}`)
      setErrorCode("INVALID_FILE_TYPE")
      return
    }

    // Limpar erro anterior
    setUploadError(null)
    setErrorCode(null)
    
    // Mostrar preview se for imagem
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (isVideo) {
      // Para vídeos, podemos mostrar o primeiro frame ou simplesmente o nome
      setPreviewUrl("video") // Marcador para indicar que temos um vídeo
    }

    // Iniciar upload
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", bucket)
      if (folder) {
        formData.append("folder", folder)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        setErrorCode(errorData.code || null)
        throw new Error(errorData.error || "Erro no upload")
      }

      const data = await response.json()
      onFileUploaded(data.url)
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      setUploadError(error instanceof Error ? error.message : "Falha ao fazer upload do arquivo. Tente novamente.")
      // Se o upload falhar, remover o preview
      if (!currentFileUrl) {
        setPreviewUrl("")
      } else {
        setPreviewUrl(currentFileUrl)
      }
    } finally {
      setIsUploading(false)
      // Limpar o input de arquivo para permitir fazer upload do mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveFile = () => {
    setPreviewUrl("")
    onFileUploaded("") // Notificar o componente pai que não há arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setUploadError(null)
    setErrorCode(null)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Input
        type="file"
        ref={fileInputRef}
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {!previewUrl ? (
        <Button
          type="button"
          variant={variant}
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full border-dashed flex items-center justify-center h-24 p-2"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-6 w-6 mb-1" />
            {isUploading ? "Enviando..." : isImage ? "Selecionar Imagem" : isVideo ? "Selecionar Vídeo" : "Selecionar Arquivo"}
          </div>
        </Button>
      ) : (
        <div className="relative group border rounded-md overflow-hidden">
          {isImage && previewUrl !== "video" ? (
            <div className="relative w-full h-40">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={previewUrl.startsWith("data:")} // Não otimizar para data URLs (previews locais)
              />
            </div>
          ) : isVideo || previewUrl === "video" ? (
            <div className="flex items-center justify-center bg-gray-900 h-40">
              <Film className="h-16 w-16 text-gray-400" />
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 h-40">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm">Arquivo carregado</p>
              </div>
            </div>
          )}
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadError && (
        <div className="text-sm text-red-500 space-y-2">
          <p>{uploadError}</p>
          {errorCode === "BUCKET_NOT_FOUND" && (
            <Link href="/admin/settings" className="flex items-center text-xs text-blue-400 hover:text-blue-300">
              <Settings className="h-3 w-3 mr-1" />
              Ir para configurações para criar o bucket
            </Link>
          )}
        </div>
      )}
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
} 