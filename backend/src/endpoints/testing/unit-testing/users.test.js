const request = require("supertest");
const express = require("express");
const endpoint = require("../../users");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/users", endpoint);

describe("GET /users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUsers = [
        {
            userid: 1,
            username: "admin",
            email: "admin@test.com"
        }
    ];

    test("should return all users with status 200", async () => {
        pool.query.mockResolvedValue({ rows: mockUsers });
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUsers);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users");
    });

    test("should return empty array when no users exist", async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test("should return 500 when database fails", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

describe("DELETE /users/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should delete a user and return 200", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });
        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User deleted");
    });

    test("should return 404 if user does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });
        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("should return 500 when database error occurs", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});