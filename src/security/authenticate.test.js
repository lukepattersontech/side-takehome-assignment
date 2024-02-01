const { authenticate } = require("./authenticate")

describe("authenticate", () => {
  describe("when missing header", () => {
    it("throws an error", async () => {
      const opts = {
        req: { headers: {} },
        userAPI: null,
      }
      await expect(authenticate(opts)).resolves.toThrow(Error)
    })
  })

  describe("when missing token", () => {
    it("throws an error", async () => {
      const opts = {
        req: { headers: { authorization: undefined } },
        userAPI: null,
      }
      await expect(authenticate(opts)).resolves.toThrow(Error)
    })
  })

  describe("when invalid token", () => {
    it("throws an error", async () => {
      const opts = {
        req: { headers: { authorization: "abcdefg" } },
        userAPI: null,
      }
      await expect(authenticate(opts)).resolves.toThrow(Error)
    })
  })

  describe("when valid token", () => {
    const validUser = {
      _id: "123456789",
      token: "676cfd34-e706-4cce-87ca-97f947c43bd4",
    }
    it("calls db and returns user id", async () => {
      // Create fake copy rather than requiring the real API class
      const userAPI = {
        getUserByToken: () => {},
      }

      // Have method return
      let spy = jest.spyOn(userAPI, "getUserByToken").mockImplementation(() => {
        return { _id: validUser._id }
      })

      const opts = {
        req: {
          headers: {
            authorization: "Bearer: " + validUser.token,
          },
        },
        userAPI,
      }
      const result = await authenticate(opts)
      expect(spy).toHaveBeenCalled()
      expect(result).toBe(validUser._id)
    })
  })
})
