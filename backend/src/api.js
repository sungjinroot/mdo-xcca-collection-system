require('dotenv').config({ path: '../../../.env'});
const express = require('express');
const pool = require("./db");
const app = express();
const cors = require('cors');

const perms = require("./middleware")

app.use(express.json()); 

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:5173' 
  ]
}));

// MIDDLEWARE: Admin Only (Google SSO)
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      role: 'admin',
      canAdd: true,
    };

    next();
  } catch (err) {
    console.error('Admin Auth Error:', err);
    return res.sendStatus(403);
  }
}

// MIDDLEWARE: Admin (SSO) or Assistant (JWT)
async function requireAdminOrAssistant(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  // Try Google SSO first (admin)
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      role: 'admin',
      canAdd: true,
    };

    return next();
  } catch {
    console.log("Not admin... checking assistant privileges now")
  }

  // Try JWT (assistant)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.role !== 'assistant') return res.sendStatus(403);
    req.user = user;
    return next();
  });
}

//Routes to Upload Folder
app.use('/uploads', express.static('/app/uploads'));

//route for temporary storage of sample pictures
app.use('/src/assets/temp', express.static('src/assets/temp'));

const artifactEndpoint = require('./endpoints/artifacts');
const artifactDisplayEndpoint = require('./endpoints/artifactsdisplay');
const roomEndpoint = require('./endpoints/rooms');
const categoriesEndpoint = require('./endpoints/categories');
const usersEndpoint = require('./endpoints/users');
const authEndpoint = require('./endpoints/auth');
const downloadEndpoint = require('./endpoints/download');


//Someone pls implement the middleware... please... im tired asf
app.use('/api/v1/artifacts',artifactEndpoint); //admin
app.use('/api/v1/artifactsdisplay',artifactDisplayEndpoint); //guest admin assistant
app.use('/api/v1/download', downloadEndpoint); //admin
app.use('/api/v1/auth', authEndpoint); //public
app.use('/api/v1/rooms', roomEndpoint); //public
app.use('/api/v1/categories', categoriesEndpoint); //admin for deletion and edit. 
app.use('/api/v1/users', usersEndpoint); //admin

//AALV endpoints
const uploadEndpoint = require('./endpoints/upload'); //admin
const imageEndpoint = require('./endpoints/artifactImages'); 
const changeThumbnail = require('./endpoints/changeThumbnail'); //admin 
const changeRoom = require('./endpoints/changeRoom'); //admin
const artifactCategories = require('./endpoints/artifactCategories'); //admin


//AALV endpoints
app.use('/api/v1/upload/',uploadEndpoint); //admin
app.use('/api/v1/images/', imageEndpoint); //admin
app.use('/api/v1/thumbnail', changeThumbnail); //admin 
app.use('/api/v1/changeroom',changeRoom); //admin
app.use('/api/v1/artifact/categories',artifactCategories); //admin


/*Ping Database*/
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({ message: "Database is running" });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB FAILED");
    }
});

module.exports = app;