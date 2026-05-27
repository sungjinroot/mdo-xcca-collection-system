const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifactsdisplay");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/artifactsdisplay", endpoint);



describe("GET /artifactsdisplay", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return paginated artifacts with no filters", async () => {

        // Mock 1: COUNT query 
        pool.query.mockResolvedValueOnce({ rows: [{ count: "2" }] });

        // Mock 2: Main data query
        pool.query.mockResolvedValueOnce({
            rows: [
                {
                    artifactid: 1,
                    accessionno: "ACC-001",
                    roomid: 1,
                    roomname: "Room A",
                    englishname: "Clay Pot",
                    vernacularname: "Palayok",
                },
                {
                    artifactid: 2,
                    accessionno: "ACC-002",
                    roomid: 2,
                    roomname: "Room B",
                    englishname: "Woven Basket",
                    vernacularname: "Basket",
                },
            ],
        });

        // Mock 3: Overall total count
        pool.query.mockResolvedValueOnce({ rows: [{ total: "50" }] });

        const res = await request(app).get("/artifactsdisplay");

        /*
        Reference in artifactsdisplay.js

        endpoint.get('/', async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = 20;
            const offset = (page - 1) * limit;
            // No filters → whereClause = ''
            // Runs 3 queries: COUNT, main SELECT, overall COUNT
        */

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0]).toMatchObject({
            artifactid: 1,
            accessionno: "ACC-001",
            englishname: "Clay Pot",
        });

        expect(res.body.pagination).toEqual({
            currentPage: 1,
            totalPages: 1,
            totalRows: 2,
            limit: 20,
        });

        expect(res.body.statistics).toEqual({
            overallTotal: 50,
            currentRoomTotal: null, 
        });

        // 3 queries fired: filtered COUNT, main SELECT, overall COUNT
        expect(pool.query).toHaveBeenCalledTimes(3);
    });

    test("should filter by search term", async () => {

        // Mock 1: COUNT query (filtered total)
        pool.query.mockResolvedValueOnce({ rows: [{ count: "1" }] });

        // Mock 2: Main data query
        pool.query.mockResolvedValueOnce({
            rows: [
                {
                    artifactid: 1,
                    accessionno: "ACC-001",
                    roomid: 1,
                    roomname: "Room A",
                    englishname: "Clay Pot",
                    vernacularname: "Palayok",
                },
            ],
        });

        // Mock 3: Overall total count
        pool.query.mockResolvedValueOnce({ rows: [{ total: "50" }] });

        const res = await request(app).get("/artifactsdisplay?search=Clay");

        /*
        Reference in artifactsdisplay.js

        const search = req.query.search
            ? `%${req.query.search}%`
            : null;
        // search = "%Clay%"

        if (search) {
            conditions.push(`
                (
                    an.englishName ILIKE $${params.length + 1}
                    OR an.vernacularName ILIKE $${params.length + 1}
                    OR a.accessionNo ILIKE $${params.length + 1}
                )
            `);
            params.push(search);
        }
        */

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].englishname).toBe("Clay Pot");
        expect(pool.query).toHaveBeenCalledTimes(3);
    });

    test("should filter by roomID and return currentRoomTotal", async () => {

        // Mock 1: COUNT query (filtered total)
        pool.query.mockResolvedValueOnce({ rows: [{ count: "1" }] });

        // Mock 2: Main data query
        pool.query.mockResolvedValueOnce({
            rows: [
                {
                    artifactid: 3,
                    accessionno: "ACC-003",
                    roomid: 2,
                    roomname: "Room B",
                    englishname: "Wooden Shield",
                    vernacularname: "Kalasag",
                },
            ],
        });

        // Mock 3: Overall total count
        pool.query.mockResolvedValueOnce({ rows: [{ total: "50" }] });

        pool.query.mockResolvedValueOnce({ rows: [{ total: "10" }] });

        const res = await request(app).get("/artifactsdisplay?roomID=2");

        /*
        Reference in artifactsdisplay.js

        const roomID = req.query.roomID
            ? parseInt(req.query.roomID, 10)
            : null;
        // roomID = 2

        if (roomID) {
            conditions.push(`a.roomID = $${params.length + 1}`);
            params.push(roomID);
        }

        // 
        
        */

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].roomid).toBe(2);

        expect(res.body.statistics).toEqual({
            overallTotal: 50,
            currentRoomTotal: 10, // 
        });

        expect(pool.query).toHaveBeenCalledTimes(4);
    });

    test("should filter by categoryID", async () => {

        // Mock 1: COUNT query (filtered total)
        pool.query.mockResolvedValueOnce({ rows: [{ count: "1" }] });

        // Mock 2: Main data query
        pool.query.mockResolvedValueOnce({
            rows: [
                {
                    artifactid: 5,
                    accessionno: "ACC-005",
                    roomid: 1,
                    roomname: "Room A",
                    englishname: "Beaded Necklace",
                    vernacularname: "Kuwintas",
                },
            ],
        });

        // Mock 3: Overall total count
        pool.query.mockResolvedValueOnce({ rows: [{ total: "50" }] });

        const res = await request(app).get("/artifactsdisplay?categoryID=3");

        /*
        Reference in artifactsdisplay.js

        const categoryID = req.query.categoryID
            ? parseInt(req.query.categoryID, 10)
            : null;
        // categoryID = 3

        if (categoryID) {
            conditions.push(`
                EXISTS (
                    SELECT 1
                    FROM ArtifactCategories ac
                    WHERE ac.artifactID = a.artifactID
                    AND ac.categoryID = $${params.length + 1}
                )
            `);
            params.push(categoryID);
        }
        */

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].artifactid).toBe(5);
        expect(pool.query).toHaveBeenCalledTimes(3);
    });

    test("should return correct page 2 pagination", async () => {

        // Mock 1: COUNT query 25 total rows across all pages
        pool.query.mockResolvedValueOnce({ rows: [{ count: "25" }] });

        // Mock 2: Main data query — page 2 results
        pool.query.mockResolvedValueOnce({
            rows: [
                {
                    artifactid: 21,
                    accessionno: "ACC-021",
                    roomid: 3,
                    roomname: "Room C",
                    englishname: "Stone Axe",
                    vernacularname: "Palakol",
                },
            ],
        });

        // Mock 3: Overall total count
        pool.query.mockResolvedValueOnce({ rows: [{ total: "25" }] });

        const res = await request(app).get("/artifactsdisplay?page=2");

        /*
        Reference in artifactsdisplay.js

        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        // page = 2, offset = 20

        const totalPages = Math.ceil(totalRows / limit);
        // totalRows = 25, totalPages = Math.ceil(25 / 20) = 2
        */

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination).toEqual({
            currentPage: 2,
            totalPages: 2,   
            totalRows: 25,
            limit: 20,
        });
        expect(pool.query).toHaveBeenCalledTimes(3);
    });

    test("should return 500 when database error occurs", async () => {

        // Mock COUNT query throws a DB error
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app).get("/artifactsdisplay");

        /*
        Reference in artifactsdisplay.js

        } catch (err) {
            console.error('Error fetching artifacts:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
        */

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Internal server error" });
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});