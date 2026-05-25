const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifactImages");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/images", endpoint);

describe("DELETE /images/:artifactId/:pictureId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should delete picture and return 200 when picture exists", async () => {

        pool.query
            .mockResolvedValueOnce({ rowCount: 1 })   // This line checks if a picture exists, mock data rowCount = 1
            .mockResolvedValueOnce({});               // DELETE call success

        const res = await request(app).delete("/images/123/456"); // MOCKS an artifact ID and Picture ID

        /*
        Reference in artifactImages.js

        endpoint.delete("/:artifactId/:pictureId", async (req, res) => {
            const { artifactId, pictureId } = req.params;
            // artifactId = "123", pictureId = "456"
        */

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Picture deleted successfully" });
        expect(pool.query).toHaveBeenCalledTimes(2);

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            "SELECT 1 FROM pictures WHERE pictureId = $1 AND artifactId = $2",
            ["456", "123"]
        );

        /* 
        Reference in artifactImages.js

        const check = await pool.query(
            'SELECT 1 FROM pictures WHERE pictureId = $1 AND artifactId = $2',
            [pictureId, artifactId]
        );
        // pictureId = "456", artifactId = "123"
        // if (check.rowCount === 0) { ... }
        */

        expect(pool.query).toHaveBeenNthCalledWith(
            2,
            "DELETE FROM pictures WHERE pictureId = $1 AND artifactId = $2",
            ["456", "123"]
        );

        /*
        Reference in artifactImages.js

        await pool.query(
            'DELETE FROM pictures WHERE pictureId = $1 AND artifactId = $2',
            [pictureId, artifactId]
        );
        res.status(200).json({ message: 'Picture deleted successfully' });
        */
    });

    test("should return 404 when picture does not exist", async () => {

        // Mock SELECT check: no rows found
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).delete("/images/123/456");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Picture not found" });
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).not.toHaveBeenCalledWith(
            expect.stringContaining("DELETE"),
            expect.anything()
        );

        /*
        Reference in artifactImages.js

        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Picture not found' });
        }
        // DELETE never runs because we return early
        */
    });

    test("should return 500 when database error occurs", async () => {

        // Mock SELECT throws a DB error
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).delete("/images/123/456");

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error", "DB connection failed");
        expect(pool.query).toHaveBeenCalledTimes(1);

        /*
        Reference in artifactImages.js

        } catch (err) {
            console.error('DB ERROR:', err);
            res.status(500).json({ error: err.message });
        }
        */
    });
});