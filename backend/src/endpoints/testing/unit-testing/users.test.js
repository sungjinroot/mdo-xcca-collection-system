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


// GET /users
describe("GET /users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUsers = [
        { userid: 1, username: "admin", bcryptpassword: "hashedpassword" }
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

// GET /users/:id
describe("GET /users/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return a user with status 200", async () => {
        const mockUser = { userid: 1, username: "admin", bcryptpassword: "hashedpassword" };
        pool.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1 });

        const res = await request(app).get("/users/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    test("should return 404 if user does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

        const res = await request(app).get("/users/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("should return 500 when database fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("Database error"));

        const res = await request(app).get("/users/1");
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

// POST /users
describe("POST /users", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a user and return 201", async () => {
        const mockUser = { userid: 1, username: "newuser", bcryptpassword: "hashedpassword" };
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });

        const res = await request(app).post("/users").send({
            username: "newuser",
            bcryptPassword: "hashedpassword"
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(mockUser);
    });

    test("should return 400 if username is missing", async () => {
        const res = await request(app).post("/users").send({
            bcryptPassword: "hashedpassword"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("username and bcryptPassword are required");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("should return 400 if bcryptPassword is missing", async () => {
        const res = await request(app).post("/users").send({
            username: "newuser"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("username and bcryptPassword are required");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("should return 500 when database fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/users").send({
            username: "newuser",
            bcryptPassword: "hashedpassword"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

// PUT /users/:id

describe("PUT /users/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should update a user and return 200", async () => {
        const mockUser = { userid: 1, username: "updateduser", bcryptpassword: "newhashedpassword" };
        pool.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1 });

        const res = await request(app).put("/users/1").send({
            username: "updateduser",
            bcryptPassword: "newhashedpassword"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    test("should return 404 if user does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

        const res = await request(app).put("/users/999").send({
            username: "updateduser",
            bcryptPassword: "newhashedpassword"
        });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("should return 400 if username is missing", async () => {
        const res = await request(app).put("/users/1").send({
            bcryptPassword: "newhashedpassword"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("username and bcryptPassword are required");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("should return 400 if bcryptPassword is missing", async () => {
        const res = await request(app).put("/users/1").send({
            username: "updateduser"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("username and bcryptPassword are required");
        expect(pool.query).not.toHaveBeenCalled();
    });

    test("should return 500 when database fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/users/1").send({
            username: "updateduser",
            bcryptPassword: "newhashedpassword"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});

// DELETE /users/:id
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