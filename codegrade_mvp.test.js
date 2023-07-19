const request = require('supertest')
const server = require('./api/server')
const User = require('./api/users/model')

test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  // 👉 USERS
  // 👉 USERS
  // 👉 USERS
  describe('user endpoints', () => {
    describe('[POST] /api/users', () => {
      test('[1] responds with a new user', async () => {
        const newUser = { firstname: 'foo', lastname: 'bar' }
        const res = await request(server).post('/api/users').send(newUser)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toMatchObject(newUser)
      }, 750)
      test('[2] adds a new user to the db', async () => {
        const newUser = { firstname: 'fizz', lastname: 'buzz' }
        await request(server).post('/api/users').send(newUser)
        const users = await User.find()
        expect(users[users.length - 1]).toMatchObject(newUser)
      }, 750)
      test('[3] responds with the correct status code on success', async () => {
        const newUser = { firstname: 'fizz', lastname: 'buzz' }
        const res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(201)
      }, 750)
      test('[4] responds with the correct message & status code on validation problem', async () => {
        let newUser = { firstname: 'only name' }
        let res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide lastname for the user/)
        newUser = { lastname: 'only bio' }
        res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide firstname for the user/)
        newUser = {}
        res = await request(server).post('/api/users').send(newUser)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide firstname for the user/)
      }, 750)
    })
    describe('[GET] /api/users', () => {
      test('[5] can get all the users', async () => {
        const res = await request(server).get('/api/users')
        expect(res.body.length).toBeGreaterThan(0)
      }, 750)

      // test('[6] can get the correct users', async () => {
      //   const res = await request(server).get('/api/users')
      //   expect(res.body[0]).toMatchObject(initialUsers[0])
      //   expect(res.body[1]).toMatchObject(initialUsers[1])
      // }, 750)
    })
    describe('[GET] /api/users/:id', () => {
      test('[7] responds with the correct user', async () => {
        let user = await User.find()
        let { id } = user[0]
        let res = await request(server).get(`/api/users/${id}`)
        expect(res.body.id).toMatch(id)
        expect(res.body).toMatchObject(user[0]);
        // [_, { id }] = await User.find() // eslint-disable-line
        // res = await request(server).get(`/api/users/${id}`)
        // expect(res.body).toMatchObject(initialUsers[1])
      }, 750)
      test('[8] responds with the correct message & status code on bad id', async () => {
        let res = await request(server).get('/api/users/foobar')
        expect(res.status).toBe(404)
        expect(res.body.message).toMatch(/does not exist/)
      }, 750)
    })
    describe('[DELETE] /api/users/:id', () => {
      test('[9] responds with deleted user', async () => {
        let [{ id }] = await User.find()
        const choppingBlock = await User.findById(id)
        const res = await request(server).delete(`/api/users/${id}`)
        expect(res.body).toMatchObject(choppingBlock.rows[0])
      }, 750)
      test('[10] deletes the user from the db', async () => {
        let [{ id }] = await User.find()
        await request(server).delete(`/api/users/${id}`)
        const gone = await request(server).get(`/api/users/${id}`)
        expect(gone.body.message).toMatch(/The user with the specified ID does not exist/)
        expect(gone.status).toBe(404)
        // const survivors = await User.find()
        // expect(survivors).toHaveLength(initialUsers.length - 1)
      }, 750)
      // test('[11] responds with the correct message & status code on bad id', async () => {
      //   const res = await request(server).delete('/api/users/foobar')
      //   expect(res.status).toBe(404)
      //   expect(res.body.message).toMatch(/does not exist/)
      // }, 750)
    })
    describe('[PUT] /api/users/:id', () => {
      test('[12] responds with updated user', async () => {
        let [{ id }] = await User.find()
        const updates = { firstname: 'xxx', lastname: 'yyy' }
        const res = await request(server).put(`/api/users/${id}`).send(updates)
        expect(res.body).toMatchObject({ id, ...updates })
      }, 750)
      test('[13] saves the updated user to the db', async () => {
        let [_, { id }] = await User.find() // eslint-disable-line
        const updates = { firstname: 'aaa', lastname: 'bbb' }
        await request(server).put(`/api/users/${id}`).send(updates)
        let user = await request(server).get(`/api/users/${id}`)
        expect(user.body).toMatchObject({ id, ...updates })
      }, 750)
      test('[14] responds with the correct message & status code on bad id', async () => {
        const updates = { firstname: 'xxx', lastname: 'yyy' }
        const res = await request(server).put('/api/users/foobar').send(updates)
        expect(res.status).toBe(404)
        expect(res.body.message).toMatch(/does not exist/)
      }, 750)
      test('[15] responds with the correct message & status code on validation problem', async () => {
        let [user] = await User.find()
        let updates = { firstname: 'xxx' }
        let res = await request(server).put(`/api/users/${user.id}`).send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide lastname for the user/)
        updates = { lastname: 'zzz' }
        res = await request(server).put(`/api/users/${user.id}`).send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide firstname for the user/)
        updates = {}
        res = await request(server).put(`/api/users/${user.id}`).send(updates)
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/Please provide firstname for the user/)
      }, 750)
    })
  })
})
