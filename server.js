// Import required modules
const express = require('express'); // Import Express.js module
const axios = require('axios'); // Import Axios for making HTTP requests
const path = require('path'); // Import path module for working with file and directory paths

const app = express(); // Create an Express application instance
const port = 3000; // Define the port number for the server to listen on

// Define the API key and host for WordsAPI
const apiKey = 'b0271023c6mshf921d07a430cadcp1abdc1jsn9638f65380bf';
const apiHost = 'wordsapiv1.p.rapidapi.com';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define route for fetching word data
app.get('/api/word/:word', async (req, res) => {
    const word = req.params.word; // Get the word from the URL parameter
    try {
        // Make a GET request to the WordsAPI to fetch word data
        const response = await axios.get(`https://${apiHost}/words/${word}`, {
            headers: {
                'X-RapidAPI-Key': apiKey, // Add API key in the request headers
                'X-RapidAPI-Host': apiHost // Add API host in the request headers
            }
        });
        res.json(response.data); // Send the response data as JSON
    } catch (error) {
        // Log the error and send a 500 status with error message
        console.error('API error:', error.response ? error.response.data : error.message); // Debugging log
        res.status(500).json({ error: error.message }); // Send error message as JSON
    }
});

// Define route for fetching word rhymes
app.get('/api/word/:word/rhymes', async (req, res) => {
    const word = req.params.word; // Get the word from the URL parameter
    try {
        // Make a GET request to the WordsAPI to fetch rhymes for the word
        const response = await axios.get(`https://${apiHost}/words/${encodeURIComponent(word)}/rhymes`, {
            headers: {
                'X-RapidAPI-Key': apiKey, // Add API key in the request headers
                'X-RapidAPI-Host': apiHost // Add API host in the request headers
            }
        });
        res.json(response.data); // Send the response data as JSON
    } catch (error) {
        // Log the error and send a 500 status with error message
        console.error('API error:', error.response ? error.response.data : error.message); // Debugging log
        res.status(500).json({ error: error.message }); // Send error message as JSON
    }
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Log server running message
});
