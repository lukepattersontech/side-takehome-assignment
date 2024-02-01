const { setConfig, getConfig } = require("./config")

describe("config", () => {
  beforeEach(() => {
    process.env.foo = "bar"
  })
  afterEach(() => {
    delete process.env.foo
  })
  it("returns config value if exists in environment", () => {
    const result = getConfig("foo")
    expect(result).toBe("bar")
  })

  it("returns undefined if value does not exist in environment", () => {
    const result = getConfig("does-not-exist")
    expect(result).toBe(undefined)
  })

  it("changes an environment variable", () => {
    setConfig("foo", "baz")
    const result = getConfig("foo")
    expect(result).toBe("baz")
  })
})
