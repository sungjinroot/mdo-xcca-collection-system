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

const validPostBody = {
    accessionNo: "ACC-001",
    catalogueNo: "A1",
    roomID: 1,
    englishName: "Ceremonial Jar",
    vernacularName: "Banga",
    ethnicGroup: "Maranao",
    locality: "Lanao del Sur",
    placeOfOrigin: "Mindanao",
    contactPersonFullName: "Juan dela Cruz",
    dateCollectedByContactPerson: "2023-01-15",
    receiverFullName: "Maria Santos",
    receivedByReceiverDate: "2023-02-01",
    recordedBy: "Dr. Reyes",
    artifactDetails: "Earthenware jar with geometric patterns",
    artifactFunction: "Used in ceremonial rituals",
    conditionUponReceipt: "Good",
    specialRemarks: "None",
    collectionType: "DON01",
    price: null,
    artifactLength: 20.5,
    artifactWidth: 15.0,
    artifactHeight: 30.0,
    artifactDiameter: 18.0,
    categoryID: 1,
    angleName: "Front",
    pictureFilePath: "/images/jar_front.jpg",
    isProfilePicture: true,
};

describe("POST /artifacts", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 201 when artifact is successfully created", async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ artifactid: 1 }] }); // INSERT Artifacts
        pool.query.mockResolvedValueOnce({});                             // INSERT ArtifactNames
        pool.query.mockResolvedValueOnce({});                             // INSERT ArtifactProvenance
        pool.query.mockResolvedValueOnce({});                             // INSERT ContactPersons
        pool.query.mockResolvedValueOnce({});                             // INSERT PhysicalDescription
        pool.query.mockResolvedValueOnce({});                             // INSERT Acquisition
        pool.query.mockResolvedValueOnce({});                             // INSERT Dimensions
        pool.query.mockResolvedValueOnce({});                             // INSERT ArtifactCategories
        pool.query.mockResolvedValueOnce({});                             // INSERT Pictures

        const res = await request(app).post("/artifacts").send(validPostBody);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Artifact created successfully");
        expect(res.body.artifactID).toBe(1);
    });

    it("returns 400 when required fields are missing", async () => {
        const incompleteBody = { accessionNo: "ACC-002" };

        const res = await request(app).post("/artifacts").send(incompleteBody);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Missing required fields");
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

    
        const res = await request(app).post("/artifacts").send(validPostBody);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

const validPutBody = {
    accessionNo: "ACC-001-UPDATED",
    catalogueNo: "A2",
    roomID: 2,
    englishName: "Ceremonial Jar Updated",
    vernacularName: "Banga",
    ethnicGroup: "Maranao",
    locality: "Lanao del Sur",
    placeOfOrigin: "Mindanao",
    contactPersonFullName: "Juan dela Cruz",
    dateCollectedByContactPerson: "2023-01-15",
    receiverFullName: "Maria Santos",
    receivedByReceiverDate: "2023-02-01",
    recordedBy: "Dr. Reyes",
    artifactDetails: "Earthenware jar with geometric patterns",
    artifactFunction: "Used in ceremonial rituals",
    conditionUponReceipt: "Good",
    specialRemarks: "None",
    collectionType: "DON01",
    price: null,
    artifactLength: 20.5,
    artifactWidth: 15.0,
    artifactHeight: 30.0,
    artifactDiameter: 18.0,
    categoryID: 2,
    pictureID: 1,
    angleName: "Side",
    pictureFilePath: "/images/jar_side.jpg",
    isProfilePicture: false,
};

describe("PUT /artifacts/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 200 when artifact is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE Artifacts
        pool.query.mockResolvedValueOnce({});              // UPDATE ArtifactNames
        pool.query.mockResolvedValueOnce({});              // UPDATE ArtifactProvenance
        pool.query.mockResolvedValueOnce({});              // UPDATE ContactPersons
        pool.query.mockResolvedValueOnce({});              // UPDATE PhysicalDescription
        pool.query.mockResolvedValueOnce({});              // UPDATE Acquisition
        pool.query.mockResolvedValueOnce({});              // UPDATE Dimensions
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // UPDATE Pictures

        const res = await request(app).put("/artifacts/1").send(validPutBody);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Artifact updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999").send(validPutBody);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1").send(validPutBody);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

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