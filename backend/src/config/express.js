const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  credentials: true // <-- ESSENCIAL para cookies
};

module.exports = (app) => {
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
}
