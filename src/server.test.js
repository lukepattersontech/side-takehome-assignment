const { createServer, stopServer } = require("./server")

describe("server", () => {
  afterAll(async () => {
    await stopServer()
  })

  describe("when creating a new server", () => {
    it("returns a new server", async () => {
      const server = await createServer()
      await server.listen()
      await expect(server).toHaveProperty("config")
    })
  })
})
