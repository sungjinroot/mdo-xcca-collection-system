const request = require("supertest");
const app = require("../../../api");
const pool = require("../../../db");


describe("GET /api/categories - Integration", () => {
    it("should return status 200", async () => {
        const res = await request(app).get("/api/categories");
        expect(res.statusCode).toBe(200);
    });

    it("should return an array", async () => {
        const res = await request(app).get("/api/categories");
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return categories with correct fields", async () => {
        const res = await request(app).get("/api/categories");
        if (res.body.length > 0) {
            const category = res.body[0];
            expect(category).toHaveProperty("categoryid");
            expect(category).toHaveProperty("categoryname");
        } else {
            expect(res.body).toEqual([]);
        }
    });
});


describe("DELETE /api/categories/:id - Integration", () => {
    let testCategoryId;

    
    beforeEach(async () => {
        const insert = await pool.query(
            `INSERT INTO Categories (categoryName) VALUES ('Test Category') RETURNING categoryID`
        );
        testCategoryId = insert.rows[0].categoryid;
    });

    it("should delete a category and return 201", async () => {
        const res = await request(app)
            .delete(`/api/categories/${testCategoryId}`)
            .send({ categoryid: testCategoryId });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if category does not exist", async () => {
        const res = await request(app)
            .delete(`/api/categories/99999`)
            .send({ categoryid: 99999 });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});

afterAll(async () => {
    await pool.end();
});