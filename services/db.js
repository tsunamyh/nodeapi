const { Pool } = require('pg');

const pool = new Pool({
  user:"tsunamy",
  password: "12000",
  database:"users",
  port:5432,
  host:"localhost",
})

pool.connect().catch((err) => {console.log(err);})

module.exports= pool