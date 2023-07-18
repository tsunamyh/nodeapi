const express = require('express');
const http = require('http');

const router = express.Router();

router.post("/api/users", () => { });       //Creates a user using the information sent inside the request body.
router.get('/api/users', () => { });        // 	Returns an array users.
router.get('/api/users/:id', () => { });    //Returns the user object with the specified id.
router.delete('/api/users/:id', () => { }); //Removes the user with the specified id and returns the deleted user.
router.put('/api/users/:id', () => { });    //Updates the user with the specified id using data from the request body. Returns the modified user



