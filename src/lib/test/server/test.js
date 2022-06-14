const app = require("../../../server")
const supertest = require("supertest")

test("POST /viewerurl, Should return status 200", async () => {
	const data = {
		url: "http://localhost:60000/help/doc/webmailmain/11690/en",
	}

	await supertest(app)
		.post("/viewerurl")
		.send(data)
		.then(async (response) => {
			expect(response.statusCode).toBe(200)
		})
})

test("POST /viewerurl, Should return json response", async () => {
	const data = {
		url: "http://localhost:60000/help/doc/webmailmain/11690/en",
	}

	await supertest(app)
		.post("/viewerurl")
		.send(data)
		.expect(200)
		.then(async (response) => {
			expect(response.body).toEqual("POST request body {\"url\":\"http://localhost:60000/help/doc/webmailmain/11690/en\"} was sending succesfully")
		})
})

test("GET /httpd/api/search?query=how&lang=en&exact-match=false, Should return status 200", async () => {
	await supertest(app)
		.get("/httpd/api/search")
        .query("query", "how")
        .query("lang", "en")
        .query("exact-match", "false")
		.then(async (response) => {
			expect(response.statusCode).toBe(200)
		})
})

test("GET /httpd/api/search?query=how&lang=en&exact-match=false, Should return array", async () => {
	await supertest(app)
		.get("/httpd/api/search")
        .query("query", "how")
        .query("lang", "en")
        .query("exact-match", "false")
		.then(async (response) => {
			expect(Array.isArray(response.body)).toBeTruthy()
		})
})

test("GET /httpd/api/search?query=how&lang=en&exact-match=false, Should return toc content", async () => {
	await supertest(app)
		.get("/httpd/api/search?query=how&lang=en&exact-match=false")
		.then((response) => {
            expect(response.body[0].id).toBe("11712")
			expect(response.body[0].label).toBe("How to write an email")
            expect(response.body[0].url).toBe("webmailmain/html/en/2/11712.html")
            expect(response.body[0].strategyId).toBe("2")
            expect(response.body[0].strategyLabel).toBe("How tos")
            expect(response.body[0].type).toBe("CHAPTER")
            expect(response.body[0].languageCode).toBe("en")
            expect(response.body[0].content).toBe("  How to write an email   ")
			expect(response.body.length).toEqual(6)
		})
})