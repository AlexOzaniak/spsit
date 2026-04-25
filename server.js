const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// MySQL Connection Pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(isTruthy(process.env.DB_SSL) ? { ssl: { minVersion: 'TLSv1.2' } } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create spsit table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS spsit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nick VARCHAR(100),
        grade VARCHAR(10),
        category VARCHAR(50),
        mood INT,
        text LONGTEXT,
        likes INT DEFAULT 0,
        voted_for_creators BOOLEAN DEFAULT NULL,
        city VARCHAR(100),
        user_agent TEXT,
        device_info VARCHAR(500),
        ip_address_internal VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_city_created (city, created_at),
        INDEX idx_ip_internal (ip_address_internal, created_at),
        INDEX idx_text_hash (text(100))
      )
    `);
    
    connection.release();
    console.log('✓ Database initialized. spsit table ready.');
  } catch (error) {
    console.error('✗ Database error:', error.message);
    setTimeout(initDatabase, 5000);
  }
}

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API Routes
app.get('/api/ideas', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM spsit ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ideas', async (req, res) => {
  const { nick, grade, category, mood, text, deviceInfo } = req.body;
  
  // Get client IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;
  
  // Get User-Agent
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Get city from IP using free geolocation service
  let city = 'Unknown';
  try {
    const geoResponse = await fetch(`https://ip-api.com/json/${ip}?fields=city`);
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      city = geoData.city || 'Unknown';
    }
  } catch (err) {
    console.log('Geolocation fetch failed, using default');
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Check for duplicate text from same IP (last 24 hours)
    const [duplicates] = await connection.execute(
      'SELECT id FROM spsit WHERE ip_address_internal = ? AND text = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
      [ip, text]
    );
    
    if (duplicates.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Rovnaký návrh si už poslal. Skús niečo nové!' });
    }
    
    // Rate limiting: Check if user posted in last 15 seconds
    const [recentPosts] = await connection.execute(
      'SELECT id FROM spsit WHERE ip_address_internal = ? AND created_at > DATE_SUB(NOW(), INTERVAL 15 SECOND)',
      [ip]
    );
    
    if (recentPosts.length > 0) {
      connection.release();
      return res.status(429).json({ error: 'Čakaj 15 sekúnd pred ďalším návrhom.' });
    }
    
    // Insert with city, User-Agent, and device info (IP stored only for internal use)
    const [result] = await connection.execute(
      'INSERT INTO spsit (nick, grade, category, mood, text, city, user_agent, device_info, ip_address_internal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nick || null, grade, category, mood, text, city, userAgent, deviceInfo || null, ip]
    );
    
    connection.release();
    res.json({ id: result.insertId, ...req.body, city });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ideas/:id/like', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('UPDATE spsit SET likes = likes + 1 WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ideas/:id/vote', async (req, res) => {
  const { vote } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE spsit SET voted_for_creators = ? WHERE id = ?',
      [vote || null, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  await initDatabase();
});
