const request = require("supertest");
const express = require("express");
const endpoint = require("../../categories");
const pool = require("../../../db");

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/categories", endpoint);


describe("GET /categories/", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCategories = [
        { categoryID: 1, categoryName: "Tools" },
        { categoryID: 2, categoryName: "Weapons" },
        { categoryID: 3, categoryName: "Textiles" },
        { categoryID: 4, categoryName: "Ceramics" },
        { categoryID: 5, categoryName: "Jewelry" },
    ];

    it("should return all categories with status code 200", async () => {
        pool.query.mockResolvedValue({ rows: mockCategories });

        const res = await request(app).get("/categories");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockCategories);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Categories ");
    });

    it("should return JSON content type", async () => {
        pool.query.mockResolvedValue({ rows: mockCategories });

        const res = await request(app).get("/categories");

        expect(res.headers["content-type"]).toMatch(/application\/json/);
    });

    it("should return an empty array when no categories exist", async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const res = await request(app).get("/categories");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("should return categories with expected fields", async () => {
        pool.query.mockResolvedValue({ rows: mockCategories });

        const res = await request(app).get("/categories");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const category = res.body[0];
        expect(category).toHaveProperty("categoryID");
        expect(category).toHaveProperty("categoryName");
    });

    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/categories");

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Database error" });
    });
});

describe("POST /categories/", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new category and return 201", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ categoryid: 1, categoryname: 'Tools' }]
        });

        const res = await request(app)
            .post("/categories")
            .send({ categoryName: "Tools" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("categoryid");
        expect(res.body.categoryname).toBe("Tools");
    });

    it("should return 400 if categoryName is missing", async () => {
        const res = await request(app)
            .post("/categories")
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app)
            .post("/categories")
            .send({ categoryName: "Tools" });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

describe("PUT /categories/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update a category and return 200", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ categoryid: 1, categoryname: 'Updated Tools' }]
        });

        const res = await request(app)
            .put("/categories/1")
            .send({ categoryName: "Updated Tools" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("categoryid");
        expect(res.body.categoryname).toBe("Updated Tools");
    });

    it("should return 400 if categoryName is missing", async () => {
        const res = await request(app)
            .put("/categories/1")
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if category does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .put("/categories/9999")
            .send({ categoryName: "Updated Tools" });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app)
            .put("/categories/1")
            .send({ categoryName: "Updated Tools" });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

describe("DELETE /categories/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete selected category and return 201", async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ categoryid: 1 }] });

        const res = await request(app)
            .delete("/categories/1")
            .send({ categoryid: 1 });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if category does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .delete("/categories/9999")
            .send({ categoryid: 9999 });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 404 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app)
            .delete("/categories/1")
            .send({ categoryid: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});