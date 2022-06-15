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

test("POST /viewerurl, Should return status 200", async () => {
	const data = {
		url: "http://localhost:60000/help/doc/webmailmain/11690/fr",
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

test("GET /httpd/api/search?query=how&lang=en&exact-match=false, Should return toc content with lang=en and exact-match=false", async () => {
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

test("GET /httpd/api/search?query=how&lang=en&exact-match=false, Should return toc content with lang=fr and exact-match=false", async () => {
	await supertest(app)
		.get("/httpd/api/search?query=how&lang=fr&exact-match=false")
		.then((response) => {
            expect(response.body[1].id).toBe("11708")
			expect(response.body[1].label).toBe("Comment ouvrir mon courriel ?")
            expect(response.body[1].url).toBe("webmailmain/html/fr/3/11708.html")
            expect(response.body[1].strategyId).toBe("3")
            expect(response.body[1].strategyLabel).toBe("Q&R")
            expect(response.body[1].type).toBe("DOCUMENT")
            expect(response.body[1].languageCode).toBe("fr")
            expect(response.body[1].content).toBe("   Comment ouvrir mon courriel ?   Dans le navigateur de messagerie, cliquez sur la ligne d'objet de le courriel que vous souhaitez ouvrir.     ")
			expect(response.body.length).toEqual(6)
		})
})

test("GET /httpd/api/search, Should return toc content with lang=fr and exact-match=false", async () => {
	await supertest(app)
		.get("/httpd/api/search?query=how&lang=fr&exact-match=false")
		.then((response) => {
            expect(response.body[1].id).toBe("11708")
			expect(response.body[1].label).toBe("Comment ouvrir mon courriel ?")
            expect(response.body[1].url).toBe("webmailmain/html/fr/3/11708.html")
            expect(response.body[1].strategyId).toBe("3")
            expect(response.body[1].strategyLabel).toBe("Q&R")
            expect(response.body[1].type).toBe("DOCUMENT")
            expect(response.body[1].languageCode).toBe("fr")
            expect(response.body[1].content).toBe("   Comment ouvrir mon courriel ?   Dans le navigateur de messagerie, cliquez sur la ligne d'objet de le courriel que vous souhaitez ouvrir.     ")
			expect(response.body.length).toEqual(6)
		})
})

test("GET /httpd/api/search, Should return content length equal to 1", async () => {
	await supertest(app)
		.get("/httpd/api/search?query=recommend&lang=en&exact-match=true")
		.then((response) => {
			expect(response.body.length).toEqual(1)
		})
})