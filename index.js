const http = require("http")
const app = require("./src/config/express.config")
const connectDB = require("./src/config/db.config")

const httpServer = http.createServer(app)
httpServer.listen('9006', '127.0.0.1', (e) => {
  if (!e) {
    console.log("Server is running on port", 9006)
    console.log("Press CTRL+C to discontinue server...")
    connectDB()
  }
})