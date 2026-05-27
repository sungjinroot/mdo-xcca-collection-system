const request = require("supertest");
const express = require("express");
const endpoint = require("../../changeRoom");
const pool = require("../../../db");

// Creates a mock/fake database
jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/changeroom", endpoint);



describe("PUT /changeroom/:artifactId/:roomId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should update the artifact's room and return a success message", async () => {

        // Simulates the UPDATE query 
        pool.query.mockResolvedValueOnce({});

        const res = await request(app).put("/changeroom/5/3");

        /*
        Reference in changeRoom.js

        endpoint.put("/:artifactId/:roomId", async (req, res) => {
            const roomId = req.params.roomId;
            const artifactId = req.params.artifactId;
            // artifactId = "5", roomId = "3"

            const result = await pool.query(
                "UPDATE Artifacts SET roomId = $1 WHERE artifactId = $2",
                [roomId, artifactId]
            );

            res.json({ message: "Artifact Room Updated!" });
        */

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Artifact Room Updated!" });

        // Should have fired exactly 1 UPDATE query with the correct values
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE Artifacts SET roomId = $1 WHERE artifactId = $2",
            ["3", "5"] // roomId is $1, artifactId is $2
        );
    });

    test("should return 500 when database error occurs", async () => {

        // Simulates a DB crash on the UPDATE query
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).put("/changeroom/5/3");

        // Because of the simulated crash above, it should return 500
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Something went wrong" });

        // Only 1 query was attempted before the error stopped everything
        expect(pool.query).toHaveBeenCalledTimes(1);

        /*
        Reference in changeRoom.js

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
        */
    });
});