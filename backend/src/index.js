const app = require('./api.js');
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`API is up and running on port ${PORT}`)
}); //Use .env soon (testing only for now)


