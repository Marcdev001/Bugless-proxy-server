import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Proxy route
app.post('/submit-form', async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, email, message } = req.body;

    // Forward request to Google Apps Script endpoint
    const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name,
        email,
        message
      }),
    });

    // Send response back to the client
    if (response.ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Form submission failed' });
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

