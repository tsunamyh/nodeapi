// DO NOT MAKE CHANGES TO THIS FILE
const { nanoid } = require('nanoid')
const pool = require("../../services/db");

function getId() {
  return nanoid().slice(0, 5)
}

function initializeUsers() {
  return ([
    { id: getId(), firstname: 'Ed Carter', lastname: 'hero' },
    { id: getId(), firstname: 'Mary Edwards', lastname: 'super hero' },
  ]);
}

// FAKE IN-MEMORY USERS "TABLE"
// let users = initializeUsers()

// DATABASE ACCESS FUNCTIONS
async function find() {
  // SELECT * FROM users;
  try {
    const users = await pool.query('SELECT * FROM users');
    return users.rows;
  } catch (err) {
    console.log("find func faild: ", err.stack);
  }
}

async function findById(id) {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    // console.log("user", user);
    return Promise.resolve(user);
  } catch (err) {
    console.log("findById failed:", err.stack);
    return Promise.reject({ message: "The user information could not be retrieved" })
  }
  // SELECT * FROM users WHERE id = 1;
  const user = users.find(d => d.id === id);
}

async function insert({ firstname, lastname }) {
  // INSERT INTO users (name, bio) VALUES ('foo', 'bar');
  const newUser = { id: getId(),firstname, lastname };
  try {
    await pool.query("INSERT INTO users (id, firstName, lastName) VALUES ($1, $2,$3)", [newUser.id, firstname, lastname])
    return Promise.resolve(newUser);
  } catch (err) {
    console.log("insert failed", err.stack);
    return Promise.reject({ message: "There was an error while saving the user to the database" })
  }
  users.push(newUser);
}

async function update(id, changes) {
  try {
    const updatedUser = await pool.query("UPDATE users SET firstName = $1, lastName = $2 WHERE id = $3 RETURNING *", [
      changes.firstname,
      changes.lastname,
      id
    ])
    return Promise.resolve(updatedUser);
  } catch (err) {
    console.log("insert failed", err.stack);
    return Promise.reject({ message: "The user information could not be modified" })
  }
  // UPDATE users SET name = 'foo', bio = 'bar WHERE id = 1;
  const user = users.find(user => user.id === id);

  const updatedUser = { ...changes, id };
  users = users.map(d => (d.id === id) ? updatedUser : d);
}

async function remove(id) {
  try {
    const user = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id])
    return Promise.resolve(user);
  } catch (err) {
    console.log("delete from table", err.stack);
    return Promise.reject({ message: "The user could not be removed" })
  }
  // DELETE FROM users WHERE id = 1;
  const user = users.find(user => user.id === id);
  if (!user) return Promise.resolve(null);
  users = users.filter(d => d.id !== id);
}

const resetDB = () => { // ONLY TESTS USE THIS ONE
  users = initializeUsers()
}

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  resetDB, // ONLY TESTS USE THIS ONE
}
