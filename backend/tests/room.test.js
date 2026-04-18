const request = require("supertest");
const expreress = require("express");
const endpoint = require("../endpoints/rooms");
const pool = require("../db")

jest.mock("../db", () => ({
    query: jestfn(),
}));

const app = express();
app.use(express.json());
app.use("/rooms", endpoint);


describe("GET /rooms/:id", () => {

    it("should return the correct room when valid ID is provided", async () => {

        pool.query.mockResolvedValue ({
            rows: [
                { roomid: 1, name: ""}
            
            ]
        });

        const res = await request(app).get("/rooms/1");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({

            roomid: 1,
            name: "Delux Room"
        })
    })
})