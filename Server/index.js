const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./App/Config/db.js');
const cors = require('cors');
const authRoutes = require('./App/Routes/auth.js');
const issueRoutes = require('./App/Routes/Issue.js');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


connectDB();


app.get('/ping', (req, res) => {
  res.send('pong');
});


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
