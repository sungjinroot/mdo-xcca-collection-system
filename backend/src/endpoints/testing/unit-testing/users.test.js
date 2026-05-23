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


    // Creats mock user as substitute for the users in the real Database

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

        // Simulates DB Error
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

        // Creates a mock DB for the user.
        const mockUser = { userid: 1, username: "newuser", bcryptpassword: "hashedpassword" };
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });

        const res = await request(app).post("/users").send({
            username: "newuser",
            password: "plaintextpassword"
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User created successfully");
        expect(res.body.user).toEqual(mockUser);

        /* 
        
        mockUser is = user: result.row[0]

        Referenced back to users.js 

           res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
        
        */
    });



    // This test returns 400 is no username is provided in the login

    test("should return 400 if username is missing", async () => {
        const res = await request(app).post("/users").send({

            // There should be a provided username is this area
            // For instance: username: "newuser"
            password: "plaintextpassword"  
        
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username and password are required");
        expect(pool.query).not.toHaveBeenCalled();
    });


        // This test returns 400 is no password is provided in the login

    test("should return 400 if Password is missing", async () => {
        const res = await request(app).post("/users").send({

            username: "newuser"
            // There should be a provided username is this area
            // For instance:  password: "plaintextpassword" 

        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username and password are required");
        expect(pool.query).not.toHaveBeenCalled();

        /*
        
        Reference in users.js

                if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            });
        }
        
        
        
        */
    });

    test("should return 500 when database fails", async () => {

        // This line here simulates a DB Failure, so DB will always crash no matter the cirucmstances
        pool.query.mockRejectedValueOnce(new Error("DB failure"));


        const res = await request(app).post("/users").send({
            username: "newuser",
            password: "plaintextpassword"
        });

        // Because of the simultion in line 139, It will return a ERROR 500
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");

        /* If referenced back in user.js 

        There is a    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({
            error: err.message
        });

        */

    });
});

// DELETE /users/:id
describe("DELETE /users/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });




    test("should delete a user and return 200", async () => {

        // Simulates mock Rowcount to be === 1
        // It means there is a user in the DB
        pool.query.mockResolvedValueOnce({ rowCount: 1 });


        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User deleted");

        // Deletes that users with an ID =1 

        /* 
        Reference in User.js 


        
        */
    });

    test("should return 404 if user does not exist", async () => {


        // Since mock rowCOunt === 0 , then user does not exists in DB

        pool.query.mockResolvedValueOnce({ rowCount: 0 });
        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");


        /* Reference in user.js

         if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
            
             const { id } = req.params;
            const result = await pool.query(
            "DELETE FROM users WHERE userID = $1",
            [id]
        );
        */
    });

    test("should return 500 when database error occurs", async () => {

        // Simulates DB ERROR
        pool.query.mockRejectedValueOnce(new Error("DB failure"));


        const res = await request(app).delete("/users/1");
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");

        
        /* Reference in user.js

        } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
        }
    
        */
    });
});