//const { assert, expect } = require("jest")
const parseBearerToken = require("./parse-bearer-token")

describe("parse-bearer-token", () => {
  it("parses valid headers", () => {
    const validRequests = [
      {
        headers: {
          authorization: "Bearer: foo",
        },
      },
      {
        headers: {
          authorization: "bearer: foo",
        },
      },
      {
        headers: {
          authorization: "Bearer foo",
        },
      },
      {
        headers: {
          authorization: "bearer foo",
        },
      },
    ]
    validRequests.map((req) => {
      const result = parseBearerToken(req)
      expect(result).toBe("foo")
    })
  })

  it("rejects invalid headers", () => {
    const inValidRequests = [
      {
        headers: {
          authorization: "Bearer:foo",
        },
      },
      {
        headers: {
          authorization: "Bearer:",
        },
      },
      {
        headers: {
          authorization: "Bearer",
        },
      },
      {
        headers: {},
      },
      {},
    ]
    inValidRequests.map((req) => {
      const result = parseBearerToken(req)
      expect(result).toBe(null)
    })
  })
})
