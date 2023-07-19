const app = require('./api/server');
const http = require('http');
const pool = require('./services/db');

const port = 3000;


async function start() {
  pool.connect()
  .then(() => {
    console.log("Connected!!")
    http.createServer(app).listen(port,()=> console.log(`listening on port ${port}`))
  })
  .catch((err) => console.log(err.stack))
}

start()
// START YOUR SERVER HERE


