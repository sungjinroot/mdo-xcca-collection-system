const express = require('express');
const pool = require("./db");
const app = express();
const cors = require('cors');


app.use(express.json()); 

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:5173' 
  ]
}));

/* Admin */
async function authenticateGoogleSSO(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

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
    console.error('Google SSO Auth Error:', err);
    return res.sendStatus(403);
  }
}

/* Internal */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    }
  );
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

app.use('/api/v1/artifacts',artifactEndpoint);
app.use('/api/v1/artifactsdisplay', artifactDisplayEndpoint);
app.use('/api/v1/download', downloadEndpoint);
app.use('/api/v1/auth', authEndpoint);
app.use('/api/v1/rooms', roomEndpoint);
app.use('/api/v1/categories', categoriesEndpoint);
app.use('/api/v1/users', usersEndpoint);

//AALV endpoints
const uploadEndpoint = require('./endpoints/upload');
const imageEndpoint = require('./endpoints/artifactImages');
const changeThumbnail = require('./endpoints/changeThumbnail');
const changeRoom = require('./endpoints/changeRoom');
const artifactCategories = require('./endpoints/artifactCategories');


//AALV endpoints
app.use('/api/v1/upload/',uploadEndpoint);
app.use('/api/v1/images/', imageEndpoint);
app.use('/api/v1/thumbnail', changeThumbnail);
app.use('/api/v1/changeroom',changeRoom);
app.use('/api/v1/artifact/categories',artifactCategories);


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