const request = require("supertest");
const app = require("../../../api")


//POST with database interaction
describe('POST /rooms/', () => {
  it('should create a room and return 201', async () => {
  
    const newRoom = {
      roomName: 'Hall A',
      title: 'Ancient Artifacts',
      caption: 'Early period items',
      roomPictureURL: 'https://example.com/hall-a.jpg'
    }

    const res = await request(app)
      .post('/api/rooms')
      .send(newRoom)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('roomid')
    expect(res.body.roomname).toBe('Hall A')
  })

  it('should return 400 if roomName is missing', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ title: 'Ancient Artifacts' })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Hall A' })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})