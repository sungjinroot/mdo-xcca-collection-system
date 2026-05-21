const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifacts");
const pool = require("../../../db");

const app = express();
app.use(express.json());
app.use("/artifacts", endpoint);

describe("Artifacts API - PUT Endpoints Integration Tests", () => {
    const TEST_ARTIFACT_ID = 1;
    const NON_EXISTENT_ID = 99999;

    // Verify test data exists before running tests
    beforeAll(async () => {
        const result = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        if (result.rows.length === 0) {
            throw new Error(`Test artifact ${TEST_ARTIFACT_ID} not found. Please run reset.sql first.`);
        }
    });

    describe("PUT /artifacts/:id/artifactDetails", () => {
        it("should return 200 and update accessionNo only", async () => {
            const updateData = { accessionNo: "UPDATED-ACC-001" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactDetails updated successfully");

            // Verify in database
            const verify = await pool.query(
                'SELECT accessionNo FROM Artifacts WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].accessionno).toBe("UPDATED-ACC-001");
        });

        it("should return 200 and update catalogueNo with valid value", async () => {
            const updateData = { catalogueNo: "A5" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT catalogueNo FROM Artifacts WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].catalogueno).toBe("A5");
        });

        it("should return 200 and update storageLocation only", async () => {
            const updateData = { storageLocation: "New Shelf Location" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT storageLocation FROM Artifacts WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].storagelocation).toBe("New Shelf Location");
        });

        it("should return 400 when catalogueNo has invalid value", async () => {
            const updateData = { catalogueNo: "B1" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("catalogueNo must be one of: A1, A2, A3, A4, A5");
        });

        it("should return 400 when no fields provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });

        it("should return 404 when artifact not found", async () => {
            const res = await request(app)
                .put(`/artifacts/${NON_EXISTENT_ID}/artifactDetails`)
                .send({ accessionNo: "TEST" });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Artifact not found");
        });
    });

    describe("PUT /artifacts/:id/artifactNames", () => {
        it("should return 200 and update englishName only", async () => {
            const updateData = { englishName: "Updated English Name" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactNames`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactNames updated successfully");

            const verify = await pool.query(
                'SELECT englishName FROM ArtifactNames WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].englishname).toBe("Updated English Name");
        });

        it("should return 200 and update vernacularName only", async () => {
            const updateData = { vernacularName: "Updated Vernacular" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactNames`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT vernacularName FROM ArtifactNames WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].vernacularname).toBe("Updated Vernacular");
        });

        it("should return 400 when no fields provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactNames`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });

        it("should return 404 when artifact not found", async () => {
            const res = await request(app)
                .put(`/artifacts/${NON_EXISTENT_ID}/artifactNames`)
                .send({ englishName: "Test" });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Artifact not found");
        });
    });

    describe("PUT /artifacts/:id/artifactProvenance", () => {
        it("should return 200 and update provenance fields", async () => {
            const updateData = { ethnicGroup: "New Ethnic Group", locality: "New Locality" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactProvenance`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactProvenance updated successfully");

            const verify = await pool.query(
                'SELECT ethnicGroup, locality FROM ArtifactProvenance WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].ethnicgroup).toBe("New Ethnic Group");
            expect(verify.rows[0].locality).toBe("New Locality");
        });

        it("should return 200 and update placeOfOrigin only", async () => {
            const updateData = { placeOfOrigin: "New Origin" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactProvenance`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT placeOfOrigin FROM ArtifactProvenance WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].placeoforigin).toBe("New Origin");
        });

        it("should return 400 when no fields provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactProvenance`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    describe("PUT /artifacts/:id/contactPersons", () => {
        it("should return 200 and update contact fields", async () => {
            const updateData = { recordedBy: "New Recorder", receiverFullName: "New Receiver" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/contactPersons`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("contactPersons updated successfully");

            const verify = await pool.query(
                'SELECT recordedBy, receiverFullName FROM ContactPersons WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].recordedby).toBe("New Recorder");
            expect(verify.rows[0].receiverfullname).toBe("New Receiver");
        });

        it("should return 200 and update single field", async () => {
            const updateData = { contactPersonFullName: "Updated Contact Person" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/contactPersons`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT contactPersonFullName FROM ContactPersons WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].contactpersonfullname).toBe("Updated Contact Person");
        });

        it("should return 400 when no fields provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/contactPersons`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

describe("PUT /artifacts/:id/dimensions", () => {
    it("should return 200 and update dimension fields", async () => {
        const updateData = { artifactLength: 99.9, artifactHeight: 88.8 };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("dimensions updated successfully");

        const verify = await pool.query(
            'SELECT artifactLength, artifactHeight FROM Dimensions WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        // Parse string to float for comparison
        expect(parseFloat(verify.rows[0].artifactlength)).toBe(99.9);
        expect(parseFloat(verify.rows[0].artifactheight)).toBe(88.8);
    });

    it("should return 200 and update width and diameter", async () => {
        const updateData = { artifactWidth: 77.7, artifactDiameter: 66.6 };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
            .send(updateData);

        expect(res.status).toBe(200);

        const verify = await pool.query(
            'SELECT artifactWidth, artifactDiameter FROM Dimensions WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        // Parse string to float for comparison
        expect(parseFloat(verify.rows[0].artifactwidth)).toBe(77.7);
        expect(parseFloat(verify.rows[0].artifactdiameter)).toBe(66.6);
    });

    it("should return 200 and update single dimension field", async () => {
        const updateData = { artifactLength: 55.5 };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
            .send(updateData);

        expect(res.status).toBe(200);

        const verify = await pool.query(
            'SELECT artifactLength FROM Dimensions WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        expect(parseFloat(verify.rows[0].artifactlength)).toBe(55.5);
    });

    it("should return 400 when no fields provided", async () => {
        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("No fields provided for update");
    });
});

    describe("PUT /artifacts/:id/physicalDescription", () => {
        it("should return 200 and update physical description fields", async () => {
            const updateData = { specialRemarks: "Handle with extreme care", conditionUponReceipt: "Fair" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/physicalDescription`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("physicalDescription updated successfully");

            const verify = await pool.query(
                'SELECT specialRemarks, conditionUponReceipt FROM PhysicalDescription WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].specialremarks).toBe("Handle with extreme care");
            expect(verify.rows[0].conditionuponreceipt).toBe("Fair");
        });

        it("should return 200 and update artifactDetails only", async () => {
            const updateData = { artifactDetails: "New detailed description" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/physicalDescription`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT artifactDetails FROM PhysicalDescription WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].artifactdetails).toBe("New detailed description");
        });

        it("should return 400 when no fields provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/physicalDescription`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    describe("PUT /artifacts/:id/acquisition", () => {
    it("should return 200 and update acquisition fields", async () => {
        const updateData = { price: 999.99, collectionType: "PUR" };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("acquisition updated successfully");

        const verify = await pool.query(
            'SELECT price, collectionType FROM Acquisition WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        // Parse string to float for comparison
        expect(parseFloat(verify.rows[0].price)).toBe(999.99);
        expect(verify.rows[0].collectiontype).toBe("PUR");
    });

    it("should return 200 and update price only", async () => {
        const updateData = { price: 500.00 };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
            .send(updateData);

        expect(res.status).toBe(200);

        const verify = await pool.query(
            'SELECT price FROM Acquisition WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        // Parse string to float for comparison
        expect(parseFloat(verify.rows[0].price)).toBe(500.00);
    });

    it("should return 200 and update collectionType only", async () => {
        const updateData = { collectionType: "LOAN" };

        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
            .send(updateData);

        expect(res.status).toBe(200);

        const verify = await pool.query(
            'SELECT collectionType FROM Acquisition WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        expect(verify.rows[0].collectiontype).toBe("LOAN");
    });

    it("should return 400 when no fields provided", async () => {
        const res = await request(app)
            .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("No fields provided for update");
    });
});

    afterAll(async () => {
        await pool.end();
    });
});