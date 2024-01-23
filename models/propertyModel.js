import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerMobile: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  locationLink: {
    type: String, 
    required: true,
  },
  photos: [
    {
      contentType: {
        type: String,
      },
      cloudinaryUrl: {
        type: String,
      },
    },
  ],
  sell: {
    type: Boolean,
    default: false,
  },
  rent: {
    type: Boolean,
    default: false,
  },
  furnished: {
    type: Boolean,
    default: false,
  },
  baths: {
    type: Number,
    default: 0,
  },
  beds: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Property', propertySchema);
