const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
  credentials: true // <-- ESSENCIAL para cookies
};

module.exports = (app) => {
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../../../frontend')));
}
