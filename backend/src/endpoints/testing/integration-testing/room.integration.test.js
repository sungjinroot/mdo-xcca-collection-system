require("dotenv").config({ path: "../../../../.env.test" });


const request = require ("supertest");
const express = require("express");
const endpoint = require("../../rooms");
const pool = require("../../../db");


const app = express();
app.use(express.json());
app.use("/rooms", endpoint);

describe ("GET /rooms", () => {

    beforeAll(async () => {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Rooms (
                roomID SERIAL PRIMARY KEY,
                title VARCHAR(255),
                roomName VARCHAR(255),
                caption VARCHAR(255),
                roomPictureURL VARCHAR(255)
            )
        `);

        await pool.query(`
            INSERT INTO Rooms (title, roomName, caption, roomPictureURL) VALUES
            ('Hall A', 'Ancient Gallery', 'Artifacts from ancient times', 'roomA.jpg'),
            ('Hall B', 'Cultural Gallery', 'Cultural heritage display', 'roomB.jpg')
        `);
    });

    afterAll(async () => {
        await pool.query("DROP TABLE IF EXISTS Rooms");
        await pool.end();
    });

    it("should return all rooms with status 200", async () => {
        const res = await request(app).get("/rooms");

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(2);
    });

    it("should return correct room details", async () => {
        const res = await request(app).get("/rooms");
        const room = res.body[0];

        expect(room).toHaveProperty("roomid");
        expect(room).toHaveProperty("title");
        expect(room).toHaveProperty("roomname");
        expect(room).toHaveProperty("caption");
        expect(room).toHaveProperty("roompictureurl");
    });

    it("should return correct data", async () => {
        const res = await request(app).get("/rooms");

        expect(res.body[0]).toMatchObject({
            title: "Hall A",
            roomname: "Ancient Gallery",
        });
    });
});