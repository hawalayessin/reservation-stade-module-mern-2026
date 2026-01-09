const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stadiums', require('./routes/stadiumRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/availabilities', require('./routes/availabilityRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('API Stadium Reservation is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
