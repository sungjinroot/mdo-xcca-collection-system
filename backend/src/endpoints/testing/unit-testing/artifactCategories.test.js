const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifactCategories");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/artifact/categories", endpoint);



describe("GET /artifact/categories/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return all categories with artifact join data for a given artifact id", async () => {

        // Mock a successful SELECT from the categories + artifactcategories join
        pool.query.mockResolvedValueOnce({
            rows: [
                { categoryid: 1, categoryname: "Pottery", artifactid: "42" },
                { categoryid: 2, categoryname: "Textile", artifactid: null }, 
            ],
        });

        const res = await request(app).get("/artifact/categories/42");

        /*
        Reference in artifactCategories.js

        endpoint.get('/:id', async (req, res) => {
            const { id } = req.params;
            // id = "42"
            const result = await pool.query(
                'SELECT c.categoryid, c.categoryname, ac.artifactid
                 FROM categories c
                 LEFT JOIN artifactcategories ac
                 ON c.categoryid = ac.categoryid AND ac.artifactid = $1
                 ORDER BY c.categoryid;',
                [id]
            );
            res.json(result.rows);
        */

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
            { categoryid: 1, categoryname: "Pottery", artifactid: "42" },
            { categoryid: 2, categoryname: "Textile", artifactid: null },
        ]);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT c.categoryid, c.categoryname, ac.artifactid FROM categories c LEFT JOIN artifactcategories ac ON c.categoryid = ac.categoryid AND ac.artifactid = $1 ORDER BY c.categoryid;",
            ["42"]
        );
    });

    test("should return 500 when database error occurs on GET", async () => {

        // Mock SELECT throws a DB error
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).get("/artifact/categories/42");

        /*
        Reference in artifactCategories.js

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch room' });
        }
        */

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Failed to fetch room" });
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});



describe("POST /artifact/categories", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should insert artifact-category link and return 201", async () => {

        // Mock a successful INSERT (no rows returned on INSERT without RETURNING)
        pool.query.mockResolvedValueOnce({});

        const res = await request(app)
            .post("/artifact/categories")
            .send({ categoryId: 3, artifactId: 99 });

        /*
        Reference in artifactCategories.js

        endpoint.post('/', async (req,res) => {
            const {categoryId, artifactId} = req.body
            // categoryId = 3, artifactId = 99

            const result = await pool.query(
                'INSERT INTO artifactcategories (artifactid,categoryid) VALUES ($1,$2)',
                [artifactId, categoryId]
            );

            res.status(201).json({
                message: "Artifact Successfully Categorized",
            });
        */

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: "Artifact Successfully Categorized" });
        expect(pool.query).toHaveBeenCalledTimes(1);

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO artifactcategories (artifactid,categoryid) VALUES ($1,$2)",
            [99, 3]
        );

        /*
        Note: the INSERT uses [artifactId, categoryId] order → [$1, $2],
        even though the body keys are named categoryId first. See:

        endpoint.post('/', async (req,res) => {
            const {categoryId, artifactId} = req.body   ← destructured together
            pool.query('INSERT INTO artifactcategories (artifactid,categoryid) VALUES ($1,$2)',
                       [artifactId, categoryId])          ← artifactId is $1
        */
    });

    test("should return 500 when database error occurs on POST", async () => {

        // Mock INSERT throws a DB error
        pool.query.mockRejectedValueOnce(new Error("Unique constraint violation"));

        const res = await request(app)
            .post("/artifact/categories")
            .send({ categoryId: 3, artifactId: 99 });

        /*
        Reference in artifactCategories.js

        } catch (err) {
            console.error('DB ERROR:', err)
            res.status(500).json({ error: err.message })
        }
        */

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error", "Unique constraint violation");
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});


describe("DELETE /artifact/categories", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should remove artifact-category link and return 201", async () => {

        // Mock a successful DELETE (no rows returned on DELETE without RETURNING)
        pool.query.mockResolvedValueOnce({});

        const res = await request(app)
            .delete("/artifact/categories")
            .send({ categoryId: 3, artifactId: 99 });

        /*
        Reference in artifactCategories.js

        endpoint.delete('/', async (req,res) => {
            const {categoryId, artifactId} = req.body
            // categoryId = 3, artifactId = 99

            const result = await pool.query(
                'DELETE FROM artifactcategories WHERE artifactId = $1 AND categoryId = $2',
                [artifactId, categoryId]
            );

            res.status(201).json({
                message: "Artifact Successfully Uncategorized",
            });
        */

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: "Artifact Successfully Uncategorized" });
        expect(pool.query).toHaveBeenCalledTimes(1);

        expect(pool.query).toHaveBeenCalledWith(
            "DELETE FROM artifactcategories WHERE artifactId = $1 AND categoryId = $2",
            [99, 3]
        );

        /*
        Note: same parameter ordering as POST — artifactId is $1, categoryId is $2.

        endpoint.delete('/', async (req,res) => {
            const {categoryId, artifactId} = req.body
            pool.query('DELETE FROM artifactcategories WHERE artifactId = $1 AND categoryId = $2',
                       [artifactId, categoryId])   ← artifactId is $1
        */
    });

    test("should return 500 when database error occurs on DELETE", async () => {

        // Mock DELETE throws a DB error
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .delete("/artifact/categories")
            .send({ categoryId: 3, artifactId: 99 });

        /*
        Reference in artifactCategories.js

        } catch (err) {
            console.error('DB ERROR:', err)
            res.status(500).json({ error: err.message })
        }
        */

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error", "DB connection failed");
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});