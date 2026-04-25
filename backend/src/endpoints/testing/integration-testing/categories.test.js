const request = require('supertest')
const app = require('../../index.js')

describe('POST /endpoints/categories', () => {

  it('should create a new category and return 201', async () => {
    const newCategory = {
      categoryname: 'Tools'
    }

    const res = await request(app)
      .post('/endpoints/categories')
      .send(newCategory)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('categoryid')
    expect(res.body.categoryname).toBe('Tools')
  })

  it('should return 400 if categoryname is missing', async () => {
    const res = await request(app)
      .post('/endpoints/categories')

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

})

describe('DELETE /endpoints/categories', () => {
  it('should delete selected category and return 201', async () => {

    const categoryid = {categoryid: 1}
    const res = await request(app)
      .delete('/endpoints/categories/${categoryid.categoryid}')
      .send(categoryid)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 404 if category does not exist', async () => {
    const categoryid = {categoryid: 9999}
    const res = await request(app)
      .delete('/endpoints/categories/${categoryid.categoryid}')
      .send(categoryid)

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})

const pool = require('../db.js')

afterAll(async () => {
  await pool.end()
})