const request = require("supertest");
const express = require("express");
const endpoint = require("../../artifacts");
const pool = require("../../../db");

const app = express();
app.use(express.json());
app.use("/artifacts", endpoint);

/**
 * Integration Tests for Artifacts API - PUT Endpoints
 * 
 * These tests verify that we can successfully update artifact information
 * across different database tables using the PUT endpoints.
 * 
 * Each test group corresponds to a different aspect of an artifact:
 * - Basic details (accession numbers, catalog numbers)
 * - Names (English and vernacular)
 * - Provenance (origin and locality)
 * - Contact persons
 * - Physical dimensions
 * - Physical description
 * - Acquisition information
 */
describe("Artifacts API - PUT Endpoints Integration Tests", () => {
    // Use artifact ID 1 from the test database (assumes reset.sql has been run)
    const TEST_ARTIFACT_ID = 1;
    const NON_EXISTENT_ID = 99999;

    // ----- Setup: Verify test data exists before running tests -----
    beforeAll(async () => {
        const result = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [TEST_ARTIFACT_ID]
        );
        if (result.rows.length === 0) {
            throw new Error(`Test artifact ${TEST_ARTIFACT_ID} not found. Please run reset.sql first.`);
        }
    });

    // =================================================================
    // TEST GROUP 1: Updating Artifact Details (catalog numbers, location)
    // =================================================================
    describe("PUT /artifacts/:id/artifactDetails", () => {
        it("should update accession number only", async () => {
            const updateData = { accessionNo: "UPDATED-ACC-001" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactDetails updated successfully");

            // Verify the change was saved to the database
            const verify = await pool.query(
                'SELECT accessionNo FROM Artifacts WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].accessionno).toBe("UPDATED-ACC-001");
        });

        it("should update catalog number with valid value (must be A1-A5)", async () => {
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

        it("should update storage location only", async () => {
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

        it("should reject invalid catalog number (only A1, A2, A3, A4, A5 allowed)", async () => {
            const updateData = { catalogueNo: "B1" }; // B1 is not valid

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send(updateData);

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("catalogueNo must be one of: A1, A2, A3, A4, A5");
        });

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactDetails`)
                .send({}); // Empty update

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });

        it("should return 404 when trying to update a non-existent artifact", async () => {
            const res = await request(app)
                .put(`/artifacts/${NON_EXISTENT_ID}/artifactDetails`)
                .send({ accessionNo: "TEST" });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Artifact not found");
        });
    });

    // =================================================================
    // TEST GROUP 2: Updating Artifact Names (English and vernacular)
    // =================================================================
    describe("PUT /artifacts/:id/artifactNames", () => {
        it("should update English name only", async () => {
            const updateData = { englishName: "Updated English Name" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactNames`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactNames updated successfully");

            // Verify the English name was updated in the database
            const verify = await pool.query(
                'SELECT englishName FROM ArtifactNames WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].englishname).toBe("Updated English Name");
        });

        it("should update vernacular name (local/common name) only", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactNames`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });

        it("should return 404 when trying to update a non-existent artifact", async () => {
            const res = await request(app)
                .put(`/artifacts/${NON_EXISTENT_ID}/artifactNames`)
                .send({ englishName: "Test" });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Artifact not found");
        });
    });

    // =================================================================
    // TEST GROUP 3: Updating Provenance Information (origin and locality)
    // =================================================================
    describe("PUT /artifacts/:id/artifactProvenance", () => {
        it("should update multiple provenance fields at once", async () => {
            const updateData = { ethnicGroup: "New Ethnic Group", locality: "New Locality" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactProvenance`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("artifactProvenance updated successfully");

            // Verify both fields were updated in the database
            const verify = await pool.query(
                'SELECT ethnicGroup, locality FROM ArtifactProvenance WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].ethnicgroup).toBe("New Ethnic Group");
            expect(verify.rows[0].locality).toBe("New Locality");
        });

        it("should update place of origin only", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/artifactProvenance`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    // =================================================================
    // TEST GROUP 4: Updating Contact Persons (recorders, receivers)
    // =================================================================
    describe("PUT /artifacts/:id/contactPersons", () => {
        it("should update multiple contact fields at once", async () => {
            const updateData = { recordedBy: "New Recorder", receiverFullName: "New Receiver" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/contactPersons`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("contactPersons updated successfully");

            // Verify both contact fields were updated
            const verify = await pool.query(
                'SELECT recordedBy, receiverFullName FROM ContactPersons WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].recordedby).toBe("New Recorder");
            expect(verify.rows[0].receiverfullname).toBe("New Receiver");
        });

        it("should update a single contact field", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/contactPersons`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });
    
    // =================================================================
    // TEST GROUP 5: Updating Dimensions (length, height, width, diameter)
    // =================================================================
    describe("PUT /artifacts/:id/dimensions", () => {
        it("should update length and height fields", async () => {
            const updateData = { artifactLength: 99.9, artifactHeight: 88.8 };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("dimensions updated successfully");

            // Verify length and height (database stores as strings, parse to float for comparison)
            const verify = await pool.query(
                'SELECT artifactLength, artifactHeight FROM Dimensions WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(parseFloat(verify.rows[0].artifactlength)).toBe(99.9);
            expect(parseFloat(verify.rows[0].artifactheight)).toBe(88.8);
        });

        it("should update width and diameter fields", async () => {
            const updateData = { artifactWidth: 77.7, artifactDiameter: 66.6 };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT artifactWidth, artifactDiameter FROM Dimensions WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(parseFloat(verify.rows[0].artifactwidth)).toBe(77.7);
            expect(parseFloat(verify.rows[0].artifactdiameter)).toBe(66.6);
        });

        it("should update a single dimension field", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/dimensions`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    // =================================================================
    // TEST GROUP 6: Updating Physical Description (remarks, condition)
    // =================================================================
    describe("PUT /artifacts/:id/physicalDescription", () => {
        it("should update special remarks and condition fields", async () => {
            const updateData = { specialRemarks: "Handle with extreme care", conditionUponReceipt: "Fair" };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/physicalDescription`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("physicalDescription updated successfully");

            // Verify both description fields were updated
            const verify = await pool.query(
                'SELECT specialRemarks, conditionUponReceipt FROM PhysicalDescription WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(verify.rows[0].specialremarks).toBe("Handle with extreme care");
            expect(verify.rows[0].conditionuponreceipt).toBe("Fair");
        });

        it("should update artifact details description only", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/physicalDescription`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    // =================================================================
    // TEST GROUP 7: Updating Acquisition Information (price, collection type)
    // =================================================================
    describe("PUT /artifacts/:id/acquisition", () => {
        it("should update price and collection type", async () => {
            const updateData = { price: 999.99, collectionType: "PUR" }; // PUR = Purchased

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("acquisition updated successfully");

            // Verify both acquisition fields were updated
            const verify = await pool.query(
                'SELECT price, collectionType FROM Acquisition WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(parseFloat(verify.rows[0].price)).toBe(999.99);
            expect(verify.rows[0].collectiontype).toBe("PUR");
        });

        it("should update price only", async () => {
            const updateData = { price: 500.00 };

            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
                .send(updateData);

            expect(res.status).toBe(200);

            const verify = await pool.query(
                'SELECT price FROM Acquisition WHERE artifactID = $1',
                [TEST_ARTIFACT_ID]
            );
            expect(parseFloat(verify.rows[0].price)).toBe(500.00);
        });

        it("should update collection type only (e.g., LOAN, PUR, DONATION)", async () => {
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

        it("should reject update when no fields are provided", async () => {
            const res = await request(app)
                .put(`/artifacts/${TEST_ARTIFACT_ID}/acquisition`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("No fields provided for update");
        });
    });

    // ----- Cleanup: Close database connection after all tests -----
    afterAll(async () => {
        await pool.end();
    });
});