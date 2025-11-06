const express = require('express');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'character-counter-backend',
    pod: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

// Character count endpoint
app.post('/api/count', (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input: name is required and must be a string' 
      });
    }

    // Count characters
    const charCount = name.length;

    // Log the request
    console.log(`[${new Date().toISOString()}] Character count request:`, {
      name,
      charCount,
      pod: os.hostname()
    });

    // Send response
    res.json({
      name: name,
      charCount: charCount,
      backend: os.hostname(),
      timestamp: new Date().toISOString(),
      message: `"${name}" has ${charCount} character${charCount !== 1 ? 's' : ''}`
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Character Counter Backend Service');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Pod hostname: ${os.hostname()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
