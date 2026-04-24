# spsit — Alex & Patrik

Student feedback platform for collecting anonymous suggestions for school improvements.

## Features

✨ **Anonymous Feedback** - Students can share ideas anonymously or with their name
📊 **Categorized Ideas** - Organize feedback by category (Teaching, Cafeteria, Facilities, Rules, Wellness, Other)
😊 **Mood Indicators** - Express your feeling about the school (😄🙂😐😕😞)
❤️ **Community Support** - Like ideas you agree with
💾 **Database Persistence** - All submissions stored securely in MySQL

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Hosting Ready**: Deploy to Heroku, AWS, DigitalOcean, etc.

## Installation

### Prerequisites
- Node.js 14+ and npm
- MySQL database access
- Git

### Setup

1. **Clone or download the project**
```bash
cd hlasy-ziakov
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your MySQL connection details:
```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=3000
NODE_ENV=production
```

4. **Start the server**
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Get all ideas
```
GET /api/ideas
```

### Submit new idea
```
POST /api/ideas
Content-Type: application/json

{
  "nick": "Optional name",
  "grade": "2",
  "category": "priestory",
  "mood": 4,
  "text": "Your idea here..."
}
```

### Like an idea
```
PUT /api/ideas/:id/like
```

## Database Schema

**spsit table**
```sql
- id (INT, Primary Key)
- nick (VARCHAR 100)
- grade (VARCHAR 10)
- category (VARCHAR 50)
- mood (INT 1-5)
- text (LONGTEXT)
- likes (INT, default 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set DB_HOST=... DB_USER=... DB_PASSWORD=... DB_NAME=...
git push heroku main
```

### Environment Variables
Always set these before deployment:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `NODE_ENV=production`
- `PORT` - Server port (default: 3000)

### Security Notes
- ⚠️ Never commit `.env` file to Git
- Use strong MySQL passwords
- Enable HTTPS in production
- Set up proper firewall rules
- Use environment variables for all sensitive data

## Development

### Run in development mode
```bash
npm run dev
```

### Project Structure
```
├── index.html       # Frontend
├── script.js        # Client-side logic
├── style.css        # Styling
├── server.js        # Express backend
├── package.json     # Dependencies
├── .env             # Environment variables (not in Git)
├── .env.example     # Template for .env
└── .gitignore       # Git ignore rules
```

## Features In Development

- 📱 Mobile app version
- 🔔 Push notifications for school staff
- 📈 Analytics dashboard
- 🗳️ Voting system improvements
- 🌐 Multi-language support

## License

MIT License - Feel free to use and modify

## Support

For issues or questions, contact the developers:
- Alex
- Patrik

---

**Made with ❤️ for better schools**
