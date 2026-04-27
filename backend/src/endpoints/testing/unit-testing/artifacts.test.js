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



const mockArtifacts = [
    {
      artifactID: 1,
      accessionNo: "ACC001",
      catalogueNo: "A1",
      roomID: 1,
      storageLocation: "Shelf A1",
  
      englishName: "Stone Axe",
      vernacularName: "Palakol na Bato",
  
      ethnicGroup: "Lumad",
      locality: "Bukidnon",
      placeOfOrigin: "Mindanao",
  
      contactPersonFullName: "Juan Dela Cruz",
      dateCollectedByContactPerson: "2020-01-10",
      receiverFullName: "Maria Santos",
      receivedByReceiverDate: "2020-01-15",
      recordedBy: "Admin",
  
      artifactLength: 30.5,
      artifactWidth: 10.2,
      artifactHeight: 5.0,
      artifactDiameter: null,
  
      artifactDetails: "Made of stone with sharp edge",
      artifactFunction: "Cutting tool",
      conditionUponReceipt: "Good",
      specialRemarks: "Handle slightly worn",
  
      collectionType: "A",
      price: 0
    },
  
    {
      artifactID: 2,
      accessionNo: "ACC002",
      catalogueNo: "A2",
      roomID: 1,
      storageLocation: "Shelf A2",
  
      englishName: "Woven Cloth",
      vernacularName: "Hinabing Tela",
  
      ethnicGroup: "Ifugao",
      locality: "Ifugao",
      placeOfOrigin: "Luzon",
  
      contactPersonFullName: "Pedro Reyes",
      dateCollectedByContactPerson: "2021-02-05",
      receiverFullName: "Ana Cruz",
      receivedByReceiverDate: "2021-02-10",
      recordedBy: "Admin",
  
      artifactLength: 100.0,
      artifactWidth: 50.0,
      artifactHeight: null,
      artifactDiameter: null,
  
      artifactDetails: "Handwoven fabric",
      artifactFunction: "Clothing",
      conditionUponReceipt: "Excellent",
      specialRemarks: "Bright colors",
  
      collectionType: "C",
      price: 0
    },
  
  ];



// GET SINGLE ARTIFACTS
describe("GET /artifacts/", () => {
    
    it ("returns json status 200 and all data", async() => {

        pool.query.mockResolvedValue({
            rows: mockArtifacts
        });

        const res = await request(app).get('/artifacts/');

        expect(pool.query).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockArtifacts);


    })

    it ("returns 500 on a database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).get('/artifacts/');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Failed to fetch artifacts" });
    })


});


describe("GET /artifacts/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 200 and a single artifact by id", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [mockArtifacts[0]],
        });

        const res = await request(app).get("/artifacts/1");

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("WHERE a.artifactID = $1"), [1]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockArtifacts[0]);
    });

    it("returns 200 and uses the selected section query", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [mockArtifacts[0]],
        });

        const res = await request(app).get("/artifacts/1?only=names");

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("LEFT JOIN ArtifactNames"), [1]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockArtifacts[0]);
    });

    it("returns 404 when the artifact id is not found", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [],
        });

        const res = await request(app).get("/artifacts/999");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Artifact not found" });
    });

    it("returns 400 for an invalid artifact id", async () => {
        const res = await request(app).get("/artifacts/abc");

        expect(pool.query).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid artifact id" });
    });

    it("returns 500 on a database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).get("/artifacts/1");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Failed to fetch artifacts" });
    });
});



// DELETE ARTIFACTS


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