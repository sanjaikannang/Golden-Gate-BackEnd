import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const handleUpload = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
    });
    return res;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

export default handleUpload;
