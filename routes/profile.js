import express from 'express';
import multer from 'multer';
import User from './../models/user.js';
import { BlobServiceClient } from '@azure/storage-blob';

export const routerProfile = express.Router();

// Create a Multer storage object to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get the connection string and container name from environment variables
const connectionString = ""; // Put your connection string here
const containerName = "profilepictures"; // Name of your container blob

// Create a BlobServiceClient object using the connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Route to display the profile page
routerProfile.get('/', (req, res) => {
  res.render('users/profile', { currentUser: req.session.currentUser });
});

// Route to handle updating the profile picture
routerProfile.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const blobName = `${req.session.currentUser.username}-${req.file.originalname}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const data = req.file.buffer;
    await blockBlobClient.upload(data, data.length);
    const profilePictureUrl = blockBlobClient.url;
    // Update the user's profile picture URL in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.session.currentUser._id },
      { profilePictureUrl: profilePictureUrl },
      { new: true }
    );
    req.user = {
      _id: updatedUser._id,
      username: updatedUser.username,
      profilePictureUrl: updatedUser.profilePictureUrl
    };
    req.session.currentUser.profilePictureUrl = updatedUser.profilePictureUrl;
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error uploading profile picture');
  }
});
