import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Initialize Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Route handler for /filteredimage
app.get('/filteredimage', async (req, res) => {
  const image_url = req.query.image_url?.toString();

  // Validate image_url query
  if (!image_url) {
    return res.status(400).send('Error: Image URL is required.');
  }

  try {
    // Filter image from provided URL
    const filtered_image = await filterImageFromURL(image_url);

    // Send the filtered image file in the response
    res.status(200).sendFile(filtered_image, () => {
      // Once the response is sent, delete the temporary filtered image file
      deleteLocalFiles([filtered_image]);
    });
  } catch (error) {
    // Handle any errors that occur during filtering
    console.error('Error filtering image:', error);
    res.status(500).send('Error filtering image. Please try again.');
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("Try GET /filteredimage?image_url={{}}");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Press CTRL+C to stop the server`);
});
