const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { eventRoutes } = require('./routes/events');
const { bookingRoutes } = require('./routes/bookings');
const { profileRoutes } = require('./routes/profiles');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});