import handleUpload from '../services/cloudinaryService.js';
import Property from '../models/propertyModel.js';

// Create a new property
const createProperty = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      const photos = await Promise.all(
        req.files.map(async (file) => {
          const fileDataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          const cldRes = await handleUpload(fileDataURI);
          return { contentType: file.mimetype, cloudinaryUrl: cldRes.secure_url };
        })
      );

      const newProperty = new Property({
        userId: req.userId,
        ownerName: req.body.ownerName,
        ownerMobile: req.body.ownerMobile,
        ownerEmail: req.body.ownerEmail,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        locationLink: req.body.locationLink,
        photos: photos,
        sell: req.body.sell,
        rent: req.body.rent,
        furnished: req.body.furnished,
        baths: req.body.baths,
        beds: req.body.beds,
      });

      const savedProperty = await newProperty.save();

      res.json({ property: savedProperty, cloudinaryResponse: photos });
    } else {
      throw new Error('No files provided or invalid file data');
    }
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all property details
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    const propertiesWithImageUrl = await Promise.all(
      properties.map(async (property) => {
        try {
          if (!property.photos || property.photos.length === 0) {
            return null; // No photos to process
          }

          return {
            _id: property._id,
            userId: property.userId,
            ownerName: property.ownerName,
            ownerMobile: property.ownerMobile,
            ownerEmail: property.ownerEmail,
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            locationLink: property.locationLink,
            photos: property.photos.map((photo) => photo.cloudinaryUrl),
            sell: property.sell,
            rent: property.rent,
            furnished: property.furnished,
            baths: property.baths,
            beds: property.beds,
          };
        } catch (photoError) {
          console.error('Inner Photo processing error:', photoError);
          return null;
        }
      })
    );

    res.json(propertiesWithImageUrl.filter(Boolean));
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get properties uploaded by the current logged-in user
const getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.userId });

    const userProperties = properties.map((property) => ({
      _id: property._id,
      userId: property.userId,
      ownerName: property.ownerName,
      ownerMobile: property.ownerMobile,
      ownerEmail: property.ownerEmail,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      locationLink: property.locationLink,
      photos: property.photos.map((photo) => photo.cloudinaryUrl),
      sell: property.sell,
      rent: property.rent,
      furnished: property.furnished,
      baths: property.baths,
      beds: property.beds,
    }));

    res.json(userProperties);
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update property details
const updateProperty = async (req, res) => {
  try {
    // Check if files are being uploaded
    let updatedPhotos = [];
    if (req.files && req.files.length > 0) {
      updatedPhotos = await Promise.all(
        req.files.map(async (file) => {
          const fileDataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          const cldRes = await handleUpload(fileDataURI);
          return { contentType: file.mimetype, cloudinaryUrl: cldRes.secure_url };
        })
      );
    }

    // Find and update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ownerName: req.body.ownerName,
        ownerMobile: req.body.ownerMobile,
        ownerEmail: req.body.ownerEmail,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        locationLink: req.body.locationLink,
        photos: updatedPhotos, 
        sell: req.body.sell,
        rent: req.body.rent,
        furnished: req.body.furnished,
        baths: req.body.baths,
        beds: req.body.beds,
      },
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);

    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// get specific property details by property id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    // console.error('Get property by ID error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// search properties based on location, buy/rent, and price range
const searchProperties = async (req, res) => {
  try {
    const { location, buyOrRent, minPrice, maxPrice } = req.body;

    // Check if location parameter is provided
    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }

    // Prepare the query based on location and optional price range
    const query = {
      location: new RegExp(location, 'i'),
    };

    if (buyOrRent !== undefined) {
      // Filter based on buy/rent
      query[buyOrRent === 'buy' ? 'sell' : 'rent'] = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      // Filter based on price range
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Execute the search query
    const properties = await Property.find(query, { __v: 0 });

    // Check if properties were found
    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No properties found matching the criteria' });
    }

    // Return the matching properties
    res.json(properties);
  } catch (error) {
    // console.error('Property search error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { createProperty, getAllProperties, getUserProperties, updateProperty, deleteProperty, getPropertyById,searchProperties };
