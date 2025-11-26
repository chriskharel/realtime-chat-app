import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs';

export const parseMultipartForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      allowEmptyFiles: false,
      multiples: false
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      // Validate file type for images
      const file = files.file || files.avatar;
      if (file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file[0]?.mimetype)) {
          reject(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
          return;
        }
      }

      resolve({ fields, files });
    });
  });
};

export const saveUploadedFile = async (file, userId, type = 'avatar') => {
  if (!file || !file[0]) {
    throw new Error('No file provided');
  }

  const uploadedFile = file[0];
  const timestamp = Date.now();
  const extension = path.extname(uploadedFile.originalFilename || uploadedFile.name);
  const filename = `${userId}_${timestamp}${extension}`;
  
  // In Vercel, we'll use a cloud storage service or return base64
  // For now, we'll return the file data as base64 for client-side handling
  const fileBuffer = fs.readFileSync(uploadedFile.filepath);
  const base64Data = fileBuffer.toString('base64');
  
  return {
    filename,
    originalName: uploadedFile.originalFilename || uploadedFile.name,
    size: uploadedFile.size,
    mimetype: uploadedFile.mimetype,
    base64Data: `data:${uploadedFile.mimetype};base64,${base64Data}`,
    url: `/uploads/${type}/${filename}` // This would be a cloud storage URL in production
  };
};
