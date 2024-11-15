const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const allRoutes = require('./routes/allRoutes');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: ['POST', 'GET'],
    credentials: true
  }));
app.use('/api/places', allRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on Port ${PORT}`));