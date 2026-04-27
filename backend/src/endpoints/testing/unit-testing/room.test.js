const request = require("supertest");
const express = require("express");
const endpoint = require("../../rooms");
const pool = require("../../../db"); 

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/rooms", endpoint);

describe("GET /rooms/", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRooms = [
        { 
            roomid: 1, 
            roomname: "HALL A",
            galleryname: "Ancient Galley",
            description: 'galleryName',
            image: 'roomA.jpg'
        },
    ];

    it("should return all rooms with status code 200", async () => {
        pool.query.mockResolvedValue({
            rows: mockRooms
        });

        const res = await request(app).get("/rooms");
       
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockRooms);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Rooms ");
    });

    
    it("shoduld return JSON content type", async() => {
      pool.query.mockResolvedValue({ rows: mockRooms})


      const res = await request(app).get("/rooms");

      expect(res.headers["content-type"]).toMatch(/application\/json/);   


  });
    
    it("should retrn an empty array when no rooms exists", async () => {
      pool.query.mockResolvedValue({rows: []});

      const res = await request(app).get("/rooms");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);

    });



    
    it("should return categories with expected fields", async () => {
      pool.query.mockResolvedValue({ rows: mockRooms });

       const res = await request(app).get("/rooms");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

               const category = res.body[0];
          expect(category).toHaveProperty("roomid");
          expect(category).toHaveProperty("roomname");
          expect(category).toHaveProperty("galleryname");
          expect(category).toHaveProperty("description");
          expect(category).toHaveProperty("image");
  });
  


    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/rooms");
       
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Room does not exists" });
    });
});


describe('mock POST /rooms/', () => {

  it('should create a room and return 201', async () => {

    pool.query.mockResolvedValueOnce({
      rows: [{ 
        roomid: 1, 
        roomname: 'Hall A', 
        title: 'Ancient Artifacts', 
        caption: 'Early period items', 
        roompictureurl: 'https://example.com/hall-a.jpg' 
      }]
    })
    
    const newRoom = {
      roomName: 'Hall A',
      title: 'Ancient Artifacts',
      caption: 'Early period items',
      roomPictureURL: 'https://example.com/hall-a.jpg'
    }

    const res = await request(app)
      .post('/rooms/')
      .send(newRoom)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('roomid')
    expect(res.body.roomname).toBe('Hall A')
  })

  it('should return 400 if roomName is missing', async () => {
    const res = await request(app)
      .post('/rooms/')
      .send({ title: 'Ancient Artifacts' })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/rooms/')
      .send({ roomName: 'Hall A' })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})

describe("DELETE /rooms/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 when room is successfully deleted", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app).delete("/rooms/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Room deleted");
  });

  test("returns 400 when room has artifacts or does not exist", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).delete("/rooms/1");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Room cannot be deleted");
  });

  test("returns 500 on database error", async () => {
    pool.query.mockRejectedValueOnce(new Error("DB failure"));

    const res = await request(app).delete("/rooms/1");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("DB failure");
  });
});
