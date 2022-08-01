const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const http = require('http').createServer(app);

// Express App Config

app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:27017',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:5174',
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const stayRoutes = require('./api/stay/stay.routes');
const orderRoutes = require('./api/order/order.routes');
const { setupSocketAPI } = require('./services/socket.service');



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/stay', stayRoutes);
setupSocketAPI(http);


app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
  logger.info('Server is running on port: ' + port);
});
