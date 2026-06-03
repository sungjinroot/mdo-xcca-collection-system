const app = require('./api.js');
const PORT = 3000;



app.listen(PORT, () => {
    console.log(`API is up and running on port ${PORT}`)
}); //Use .env soon (testing only for now)


