import cloudinary from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';

export const uploadToCloudinary = (buffer, folder = 'general') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `sistema-cursos/${folder}`,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new AppError('Error al subir archivo a Cloudinary', 500));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error al eliminar de Cloudinary:', error);
    // No lanzar error para no bloquear el flujo principal
  }
};