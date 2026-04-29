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
            roomname: "Ancient Gallery",
            title: "Hall A",
            caption: "Artifacts from ancient times",
            roompictureurl: "roomA.jpg"
        },
    ];

    it("should return all rooms with status code 200", async () => {
        pool.query.mockResolvedValue({ rows: mockRooms });

        const res = await request(app).get("/rooms");

        expect(pool.query).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockRooms);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Rooms ");
    });

    it("should return JSON content type", async () => {
        pool.query.mockResolvedValue({ rows: mockRooms });

        const res = await request(app).get("/rooms");

        expect(res.headers["content-type"]).toMatch(/application\/json/);
    });

    it("should return an empty array when no rooms exist", async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const res = await request(app).get("/rooms");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    
    it("should return rooms with expected fields", async () => {
        pool.query.mockResolvedValue({ rows: mockRooms });

        const res = await request(app).get("/rooms");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const room = res.body[0];
        expect(room).toHaveProperty("roomid");
        expect(room).toHaveProperty("roomname");
        expect(room).toHaveProperty("title");
        expect(room).toHaveProperty("caption");
        expect(room).toHaveProperty("roompictureurl");
    });

    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/rooms");

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Room does not exists" });
    });
});

describe("mock POST /rooms/", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a room and return 201", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{
                roomid: 1,
                roomname: "Hall A",
                title: "Ancient Artifacts",
                caption: "Early period items",
                roompictureurl: "https://example.com/hall-a.jpg"
            }]
        });

        const newRoom = {
            roomName: "Hall A",
            title: "Ancient Artifacts",
            caption: "Early period items",
            roomPictureURL: "https://example.com/hall-a.jpg"
        };

        const res = await request(app).post("/rooms/").send(newRoom);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("roomid");
        expect(res.body.roomname).toBe("Hall A");
    });

    it("should return 400 if roomName is missing", async () => {
        const res = await request(app)
            .post("/rooms/")
            .send({ title: "Ancient Artifacts" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if title is missing", async () => {
        const res = await request(app)
            .post("/rooms/")
            .send({ roomName: "Hall A" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/rooms/").send({
            roomName: "Hall A",
            title: "Ancient Artifacts"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

describe("PUT /rooms/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const updatedRoom = {
        roomName: "Hall A Updated",
        roomPictureUrl: "https://example.com/hall-a-updated.jpg",
        title: "Ancient Artifacts Updated",
        caption: "Updated caption"
    };

    it("should update a room and return 200", async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ roomid: 1 }] }); // SELECT check
        pool.query.mockResolvedValueOnce({                            // UPDATE
            rows: [{
                roomid: 1,
                roomname: "Hall A Updated",
                title: "Ancient Artifacts Updated",
                caption: "Updated caption",
                roompictureurl: "https://example.com/hall-a-updated.jpg"
            }]
        });

        const res = await request(app).put("/rooms/1").send(updatedRoom);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Room updated");
        expect(res.body).toHaveProperty("room");
    });

    it("should return 404 if room is not found", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // SELECT returns empty

        const res = await request(app).put("/rooms/999").send(updatedRoom);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Room not found");
    });

    it("should return 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/rooms/1").send(updatedRoom);

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error", "Failed to update room");
    });
});

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