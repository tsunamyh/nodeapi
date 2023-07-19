const { Pool } = require('pg');

const pool = new Pool({
  user: "tsunamy",
  password: "12000",
  database: "users",
  port: 5432,
  host: "localhost",
})

pool.query("CREATE TABLE IF NOT EXISTS users (\
  id VARCHAR(15) NOT NULL,\
  firstname VARCHAR(30) NOT NULL,\
  lastname VARCHAR(30) NOT NULL\
  )", (err, res) => {
  console.log(err ? err.stack : res.command)
})

module.exports = pool