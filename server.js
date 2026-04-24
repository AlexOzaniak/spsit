const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// MySQL Connection Pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  const { nick, grade, category, mood, text } = req.body;
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO spsit (nick, grade, category, mood, text) VALUES (?, ?, ?, ?, ?)',
      [nick || 'Anonymný', grade, category, mood, text]
    );
    connection.release();
    res.json({ id: result.insertId, ...req.body });
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
