import express from 'express';
import multer from 'multer';
import { createProperty, getAllProperties, getUserProperties, updateProperty, deleteProperty,getPropertyById,searchProperties } from '../controllers/propertyController.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

// Configure Multer for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for handling file buffers
const upload = multer({ storage: storage });
const myUploadMiddleware = upload.array('photos', 4); // 'photos' is the field name, and 4 is the maximum number of files

router.post('/post-properties', auth, myUploadMiddleware, createProperty);
router.get('/get-properties', getAllProperties); // route for getting all the properties
router.get('/user-properties', auth, getUserProperties); //  route for getting user properties
router.put('/update-property/:id', auth, myUploadMiddleware, updateProperty); //  route for updating a property
router.delete('/delete-property/:id', auth, deleteProperty); //  route for deleting a property
router.get('/property/:id', auth, getPropertyById); // route for getting specific property details by property id
router.post('/search-properties', searchProperties); // route for searching properties based on location, buy/rent, and price range

export default router;