const request = require("supertest");
const app = require("../../../api")

describe("GET /api/rooms/", () => {

    it("should return all rooms with status code 200", async () => {
        const res = await request(app).get("/api/rooms");
       
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockRooms);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Rooms ");
    });

    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/rooms");
       
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Room does not exists" });
    });
});

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