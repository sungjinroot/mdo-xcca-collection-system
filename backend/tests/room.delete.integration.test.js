const request = require("supertest");
const express = require("express");
const endpoint = require("../src/endpoints/rooms");
const pool = require("../src/db");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/rooms", endpoint);

afterAll(async () => {
    await pool.end();
});

describe("DELETE /rooms/:id - Integration", () => {
    test("returns 400 when room has artifacts", async () => {
        const res = await request(app).delete("/rooms/1");
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

        const res = await request(app).delete(`/rooms/${roomID}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Room deleted");
    });
});