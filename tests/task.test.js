const request = require("supertest");
const app = require("../server");

describe("Task API tests", () => {

    it("should return all tasks", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});