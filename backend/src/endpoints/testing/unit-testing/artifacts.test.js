const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifacts");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/artifacts", endpoint);

describe("DELETE /artifacts/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 200 when artifact is successfully deleted", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app).delete("/artifacts/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Artifact deleted");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).delete("/artifacts/999");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).delete("/artifacts/1");
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});