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

    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/rooms");
       
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Room does not exists" });
    });
});