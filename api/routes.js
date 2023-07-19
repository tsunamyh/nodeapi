const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  find,
  findById,
  update,
  remove,
  insert
} = require("./users/model")

const router = express.Router();

router.post("/api/users",    //Creates a user using the information sent inside the request body.
  body("firstname").isLength({ min: 2, max: 30 }).withMessage("Please provide firstname for the user"),
  body("lastname").isLength({ min: 2, max: 30 }).withMessage("Please provide lastname for the user"),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors:", errors.array());
      return res.status(400).json({
        message: errors.array()[0].msg
      })
    }

    insert(req.body)
      .then((value) => {
        res.status(201).json(value)
      })
      .catch((err) => {
        console.log("error ::>", err);
        res.status(500).json({ message: "There was an error while saving the user to the database" })
      })
  }
);

router.get('/api/users', async function (req, res) {   //Returns an array users.
  find()
    .then((value) => {
      console.log(value);
      res.status(200).json(value)
    })
    .catch((err) => {
      res.status(500).json({ message: "The users information could not be retrieved" })
    })
});

router.get('/api/users/:id', async function (req, res) {   //Returns the user object with the specified id.
  const { id } = req.params
  // console.log(id);
  findById(id)
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
      return res.status(200).json(user.rows[0])
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err)
    })
});

router.delete('/api/users/:id', async function (req, res) {   //Removes the user with the specified id and returns the deleted user.
  const { id } = req.params
  remove(id)
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
      return res.status(200).json(user.rows[0])
    })
    .catch((err) => {
      res.status(500).json({ message: "The user could not be removed" })
    })
});

router.put('/api/users/:id',    //Updates the user with the specified id using data from the request body. Returns the modified user
  body("firstname").isLength({ min: 2, max: 30 }).withMessage("Please provide firstname for the user"),
  body("lastname").isLength({ min: 2, max: 30 }).withMessage("Please provide lastname for the user"),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg
      })
    }
    const { id } = req.params;
    update(id, req.body)
      .then((user) => {
        if (user.rows.length === 0) {
          return res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
        return res.status(200).json(user.rows[0])
      })
      .catch((err) => {
        res.status(500).json({
          message: "The user information could not be modified"
        })
      })
  }
);


module.exports = router