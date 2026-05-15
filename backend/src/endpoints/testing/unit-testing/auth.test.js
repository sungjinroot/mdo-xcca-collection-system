const request = require("supertest");
const express = require("express");
const endpoint = require("../../auth");
const pool = require("../../../db");
const bcrypt = require("bcrypt");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

jest.mock("bcrypt");

const app = express();
app.use(express.json());
app.use("/auth", endpoint);

describe("POST /auth/login", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("returns 200 and token on successful login", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ userid: 1, username: "admin", bcryptpassword: "hashedpassword", canadd: true }]
        });
        bcrypt.compare.mockResolvedValueOnce(true);

        const res = await request(app).post("/auth/login").send({
            username: "admin",
            password: "password123"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("returns 400 when username or password is missing", async () => {
        const res = await request(app).post("/auth/login").send({
            username: "admin"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    test("returns 401 when user is not found", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).post("/auth/login").send({
            username: "wronguser",
            password: "password123"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    test("returns 401 when password is wrong", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ userid: 1, username: "admin", bcryptpassword: "hashedpassword", canadd: false }]
        });
        bcrypt.compare.mockResolvedValueOnce(false);

        const res = await request(app).post("/auth/login").send({
            username: "admin",
            password: "wrongpassword"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    test("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/auth/login").send({
            username: "admin",
            password: "password123"
        });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
    });
});