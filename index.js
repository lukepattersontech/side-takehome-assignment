const { createServer } = require("./src/server")

;(async () => {
  const server = await createServer()
  server.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
  )
})()
