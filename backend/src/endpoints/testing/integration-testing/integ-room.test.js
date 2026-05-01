const request = require("supertest");
const app = require("../../../api")

//GET with database interaction

describe("GET /api/rooms", () =>{
  it("should return status 200", async () => {
    const res = await request(app).get("/api/rooms");
    expect(res.statusCode).toBe(200);
  })

  it("should return an array", async ()=> {
    const res = await request (app).get("/api/rooms");
    expect(Array.isArray(res.body)).toBe(true);
  })


  it("should return room with the correct fields", async () => {
    const res = await request(app).get("/api/rooms");
    console.log(res.body)
    const room = res.body[0];

    expect(room).toHaveProperty("roomid");
    expect(room).toHaveProperty("roomname");
    expect(room).toHaveProperty("title");
    expect(room).toHaveProperty("caption");
    expect(room).toHaveProperty("roompictureurl");
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

//DELETE with database interaction
describe("DELETE /rooms/:id - Integration", () => {
    const pool = require("../../../db");

    test("returns 400 when room has artifacts", async () => {
        // Room 1 has artifacts in the DB so it should be blocked
        const res = await request(app).delete("/api/rooms/1");
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Room cannot be deleted");
    });

    test("returns 200 when room has no artifacts", async () => {
        // Insert a test room first
        const insert = await pool.query(
            `INSERT INTO Rooms (title, roomName, caption, roomPictureURL) 
             VALUES ('Test', 'Test Room', 'Test', 'test.jpg') 
             RETURNING roomID`
        );
        const roomID = insert.rows[0].roomid;

        const res = await request(app).delete(`/api/rooms/${roomID}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Room deleted");
    });
});