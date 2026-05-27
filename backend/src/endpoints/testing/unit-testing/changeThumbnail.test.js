const request = require("supertest");
const express = require("express");
const endpoint = require("../../changeThumbnail");
const pool = require("../../../db");

// mock db
jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/thumbnail", endpoint);



describe("GET /thumbnail/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return all pictures for an artifact ordered by profile picture", async () => {

        // Simulates the SELECT returning two pictures for artifact 1
        pool.query.mockResolvedValueOnce({
            rows: [
                { pictureid: 10, artifactid: 1, isprofilepicture: true,  picturefilepath: "http://127.0.0.1:3000/uploads/artifacts/pic1.jpg" },
                { pictureid: 11, artifactid: 1, isprofilepicture: false, picturefilepath: "http://127.0.0.1:3000/uploads/artifacts/pic2.jpg" },
            ],
        });

        const res = await request(app).get("/thumbnail/1");

        /*
        Reference in changeThumbnail.js

        endpoint.get("/:id", async (req, res) => {
            const artifactId = req.params.id;
            // artifactId = "1"

            const result = await pool.query(
                'SELECT * FROM pictures WHERE artifactId = $1 ORDER BY isprofilepicture DESC;;',
                [artifactId]
            );

            res.status(200).json(result.rows);
        */

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);

        // Profile picture should come first since query orders by isprofilepicture DESC
        expect(res.body[0].isprofilepicture).toBe(true);
        expect(res.body[1].isprofilepicture).toBe(false);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM pictures WHERE artifactId = $1 ORDER BY isprofilepicture DESC;;",
            ["1"]
        );
    });

    test("should return 404 when no pictures are found for that artifact", async () => {

        // Simulates the SELECT returning no rows - basically no picture
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/thumbnail/999");

        /*
        Reference in changeThumbnail.js

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Thumbnail not found' });
        }
        */

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Thumbnail not found" });
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test("should return 500 when database error occurs", async () => {

        // Simulates a DB crash on the SELECT query
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).get("/thumbnail/1");

        // Because of the simulated crash above, it should return 500
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Failed to get artifact pictures" });
        expect(pool.query).toHaveBeenCalledTimes(1);

        /*
        Reference in changeThumbnail.js

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get artifact pictures' });
        }
        */
    });
});



describe("PUT /thumbnail/:artifactId/:pictureId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should set all pictures to false then set selected picture to true", async () => {

   
        pool.query
            .mockResolvedValueOnce({}) // UPDATE all to false
            .mockResolvedValueOnce({}) // UPDATE selected to true

        const res = await request(app).put("/thumbnail/1/10");

        /*
        Reference in changeThumbnail.js

        endpoint.put("/:artifactId/:pictureId", async (req, res) => {
            const artifactId = req.params.artifactId;
            const pictureId = req.params.pictureId;
            // artifactId = "1", pictureId = "10"

            // Step 1: reset all pictures for this artifact
            await pool.query(
                'UPDATE pictures SET isprofilepicture = false WHERE artifactId = $1',
                [artifactId]
            );

            // Step 2: set the chosen one as the profile picture
            await pool.query(
                'UPDATE pictures SET isprofilepicture = true WHERE pictureId = $1',
                [pictureId]
            );

            res.status(200).json({ message: "Profile picture updated" });
        */

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Profile picture updated" });

        // Should have fired exactly 2 UPDATE queries
        expect(pool.query).toHaveBeenCalledTimes(2);

        // First query: reset all pictures for that artifact to false
        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            "UPDATE pictures SET isprofilepicture = false WHERE artifactId = $1",
            ["1"]
        );

        // Second query: set the selected picture to true
        expect(pool.query).toHaveBeenNthCalledWith(
            2,
            "UPDATE pictures SET isprofilepicture = true WHERE pictureId = $1",
            ["10"]
        );
    });

    test("should return 500 when database error occurs", async () => {

        // Simulates a DB crash on the first UPDATE query
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).put("/thumbnail/1/10");

        // Because of the simulated crash above, it should return 500
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Server error" });

        // Only 1 query was attempted before the error stopped everything
        expect(pool.query).toHaveBeenCalledTimes(1);

        /*
        Reference in changeThumbnail.js

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
        */
    });
});