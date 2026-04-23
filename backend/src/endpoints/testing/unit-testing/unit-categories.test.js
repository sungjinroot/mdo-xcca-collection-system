const request = require("supertest");
const express = require("express");
const endpoint = require("../../categories");
const pool = require("../../../db"); 


jest.mock("../../../db", () => ({
    query: jest.fn(),
}));


const app = express();
app.use(express.json());
app.use("/categories", endpoint);

describe("GET /categories/", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCategories = [
        { 
            categoryID: 1, 
            categoryName: "Tools",
      
        },

        { 
            categoryID: 2, 
            categoryName: "Weapons",
      
        },

        { 
            categoryID: 3, 
            categoryName: "Textiles",
      
        },

        { 
            categoryID: 4, 
            categoryName: "Ceramics",
      
        },

        { 
            categoryID: 5, 
            categoryName: "Jewelry",
      
        },
    ];

  
    
    it("should return all categories with status code 200", async () => {
        pool.query.mockResolvedValue({
            rows: mockCategories
        });

        const res = await request(app).get("/categories");
       
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockCategories);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM categories ");
    });
    

    it("shoduld return JSON content type", async() => {
        pool.query.mockResolvedValue({ rows: mockCategories})


        const res = await request(app).get("/categories");

        expect(res.headers["content-type"]).toMatch(/application\/json/);   


    });


    it("should retrn an empty array when no categories exists", async () => {
        pool.query.mockResolvedValue({rows: []});

        const res = await request(app).get("/categories");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]); 
    
    });


    it("should return categories with expected fields", async () => {
        pool.query.mockResolvedValue({ rows: mockCategories });

         const res = await request(app).get("/categories");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

                 const category = res.body[0];
             expect(category).toHaveProperty("categoryID");
            expect(category).toHaveProperty("categoryName");
    });
    

    /*
    it("should return 500 when database query fails", async () => {
        pool.query.mockRejectedValue(new Error("Database connection failed"));

        const res = await request(app).get("/categories");
       
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: "Category does not exists" });
    });

    */


});