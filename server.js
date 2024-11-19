const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Use Helmet for security headers
app.use(helmet());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Example route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Catch the Stars Game API!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
