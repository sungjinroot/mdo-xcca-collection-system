const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifacts");
const pool = require("../../../db");

jest.mock("../../../db", () => ({
    query: jest.fn(),
    connect: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/artifacts", endpoint);

describe("GET /artifacts/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

       it("returns 200 and the artifact when found", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [
                { 
                    artifactid: 1, 
                    accessionno: 'ACC-001', 
                    englishname: 'Ceremonial Jar',
                    catalogueno: 'A1',
                    roomid: 1,
                    storagelocation: null,
                    vernacularname: 'Banga',
                    ethnicgroup: 'Maranao',
                    locality: 'Lanao del Sur',
                    placeoforigin: 'Mindanao',
                    contactpersonfullname: 'Juan dela Cruz',
                    datecollectedbycontactperson: '2023-01-15',
                    receiverfullname: 'Maria Santos',
                    receivedbyreceiverdate: '2023-02-01',
                    recordedby: 'Dr. Reyes',
                    artifactlength: 20.5,
                    artifactwidth: 15.0,
                    artifactheight: 30.0,
                    artifactdiameter: 18.0,
                    artifactdetails: 'Earthenware jar',
                    artifactfunction: 'Ceremonial',
                    conditionuponreceipt: 'Good',
                    specialremarks: 'None',
                    collectiontype: 'DON01',
                    price: null
                }
            ]
        });

        const res = await request(app).get("/artifacts/1");

        expect(res.status).toBe(200);
        // Update assertions to match nested structure
        expect(res.body).toHaveProperty('artifacts');
        expect(res.body.artifacts.artifactID).toBe(1);
        expect(res.body).toHaveProperty('artifactnames');
        expect(res.body).toHaveProperty('dimensions');
    });

    it("returns 200 with physical filter", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [
                { 
                    artifactid: 1, 
                    accessionno: 'ACC-001',
                    artifactlength: 20.5, 
                    artifactwidth: 15.0,
                    artifactheight: 30.0,
                    artifactdiameter: 18.0,
                    artifactdetails: 'Earthenware jar',
                    artifactfunction: 'Ceremonial',
                    conditionuponreceipt: 'Good',
                    specialremarks: 'None'
                }
            ]
        });

        const res = await request(app).get("/artifacts/1?filter=physical");

        expect(res.status).toBe(200);
        // Access nested property correctly
        expect(res.body.dimensions).toHaveProperty('artifactLength');
        expect(res.body.dimensions.artifactLength).toBe(20.5);
        expect(res.body.physicaldescription).toHaveProperty('artifactDetails');
    });

    it("returns 400 for invalid filter", async () => {
        const res = await request(app).get("/artifacts/1?filter=invalidfilter")

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"))

        const res = await request(app).get("/artifacts/1")

        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error')
    })
})



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
        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        pool.connect.mockResolvedValueOnce(mockClient);

        mockClient.query.mockResolvedValueOnce({});
        mockClient.query.mockResolvedValueOnce({ rows: [{ artifactid: 1 }] });
        
        for (let i = 0; i < 7; i++) {
            mockClient.query.mockResolvedValueOnce({});
        }
        
        mockClient.query.mockResolvedValueOnce({});

        const res = await request(app).post("/artifacts").send(validPostBody);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Artifact created successfully");
        expect(res.body.artifactID).toBe(1);
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it("returns 201 when artifact with categories is successfully created", async () => {
        const bodyWithCategories = {
            ...validPostBody,
            categories: [1, 2, 3]
        };

        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        pool.connect.mockResolvedValueOnce(mockClient);

        mockClient.query.mockResolvedValueOnce({});
        mockClient.query.mockResolvedValueOnce({ rows: [{ artifactid: 5 }] });
        
        for (let i = 0; i < 7; i++) {
            mockClient.query.mockResolvedValueOnce({});
        }
        
        for (let i = 0; i < 3; i++) {
            mockClient.query.mockResolvedValueOnce({});
        }
        
        mockClient.query.mockResolvedValueOnce({});

        const res = await request(app).post("/artifacts").send(bodyWithCategories);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Artifact created successfully");
        expect(res.body.artifactID).toBe(5);
        expect(mockClient.query).toHaveBeenCalledWith(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [5, 1]
        );
        expect(mockClient.query).toHaveBeenCalledWith(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [5, 2]
        );
        expect(mockClient.query).toHaveBeenCalledWith(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [5, 3]
        );
    });

    it("returns 400 when categories is not an array", async () => {
        const invalidBody = {
            ...validPostBody,
            categories: "not an array"
        };

        const res = await request(app).post("/artifacts").send(invalidBody);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Categories must be an array");
        expect(pool.connect).not.toHaveBeenCalled();
    });

    it("returns 400 when required fields are missing", async () => {
        const incompleteBody = { accessionNo: "ACC-002" };

        const res = await request(app).post("/artifacts").send(incompleteBody);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Missing required fields");
        expect(pool.connect).not.toHaveBeenCalled();
    });

    it("returns 500 on database error and rolls back", async () => {
        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        pool.connect.mockResolvedValueOnce(mockClient);

        mockClient.query.mockResolvedValueOnce({});
        mockClient.query.mockResolvedValueOnce({ rows: [{ artifactid: 1 }] });
        mockClient.query.mockResolvedValueOnce({});
        mockClient.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/artifacts").send(validPostBody);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
        expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        expect(mockClient.query).not.toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it("returns 500 when database connection fails", async () => {
    pool.connect.mockRejectedValueOnce(new Error("Connection failed"));

    const res = await request(app).post("/artifacts").send(validPostBody);

    expect(res.status).toBe(500);
    expect(res.body).toBeDefined();
});

    it("ensures client is released even after error", async () => {
        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        pool.connect.mockResolvedValueOnce(mockClient);

        mockClient.query.mockResolvedValueOnce({});
        mockClient.query.mockRejectedValueOnce(new Error("DB failure"));

        await request(app).post("/artifacts").send(validPostBody);

        expect(mockClient.release).toHaveBeenCalled();
    });
});

// Each specifier endpoint runs exactly 4 queries:
//   1. SELECT check
//   2. UPDATE the specific table
//   3. DELETE FROM ArtifactCategories
//   4. INSERT INTO ArtifactCategories

describe("PUT /artifacts/:id/artifactDetails", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = { accessionNo: "ACC-001-UPDATED", catalogueNo: "A2", roomID: 2, categoryID: 1 };

    it("returns 200 when artifactDetails is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE Artifacts
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/artifactDetails").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("artifactDetails updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 }); // SELECT check returns nothing

        const res = await request(app).put("/artifacts/999/artifactDetails").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/artifactDetails").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/artifactNames", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = { englishName: "Updated Jar", vernacularName: "Banga", categoryID: 1 };

    it("returns 200 when artifactNames is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE ArtifactNames
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/artifactNames").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("artifactNames updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/artifactNames").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/artifactNames").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/artifactProvenance", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = { ethnicGroup: "Maranao", locality: "Lanao del Sur", placeOfOrigin: "Mindanao", categoryID: 1 };

    it("returns 200 when artifactProvenance is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE ArtifactProvenance
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/artifactProvenance").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("artifactProvenance updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/artifactProvenance").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/artifactProvenance").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/contactPersons", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = {
        contactPersonFullName: "Juan dela Cruz",
        dateCollectedByContactPerson: "2023-01-15",
        receiverFullName: "Maria Santos",
        receivedByReceiverDate: "2023-02-01",
        recordedBy: "Dr. Reyes",
        categoryID: 1,
    };

    it("returns 200 when contactPersons is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE ContactPersons
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/contactPersons").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("contactPersons updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/contactPersons").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/contactPersons").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/dimensions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = { artifactLength: 20.5, artifactWidth: 15.0, artifactHeight: 30.0, artifactDiameter: 18.0, categoryID: 1 };

    it("returns 200 when dimensions is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE Dimensions
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/dimensions").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("dimensions updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/dimensions").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/dimensions").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/physicalDescription", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = {
        artifactDetails: "Earthenware jar with geometric patterns",
        artifactFunction: "Used in ceremonial rituals",
        conditionUponReceipt: "Good",
        specialRemarks: "None",
        categoryID: 1,
    };

    it("returns 200 when physicalDescription is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE PhysicalDescription
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/physicalDescription").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("physicalDescription updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/physicalDescription").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/physicalDescription").send(body);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("DB failure");
    });
});

describe("PUT /artifacts/:id/acquisition", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const body = { collectionType: "DON01", price: null, categoryID: 1 };

    it("returns 200 when acquisition is successfully updated", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // SELECT check
        pool.query.mockResolvedValueOnce({});              // UPDATE Acquisition
        pool.query.mockResolvedValueOnce({});              // DELETE ArtifactCategories
        pool.query.mockResolvedValueOnce({});              // INSERT ArtifactCategories

        const res = await request(app).put("/artifacts/1/acquisition").send(body);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("acquisition updated successfully");
    });

    it("returns 404 when artifact is not found", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).put("/artifacts/999/acquisition").send(body);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Artifact not found");
    });

    it("returns 500 on database error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).put("/artifacts/1/acquisition").send(body);

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