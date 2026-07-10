import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import {YSocketIO} from "y-socket.io/dist/server"


const app = express()
const httpServer = createServer(app)


const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const ySocketIO = new YSocketIO(io)

ySocketIO.initialize()


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
    success: true
  })
})

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true
  })
})



httpServer.listen(3000, () => {
  console.log("Server is running on port 3000")
})




//here we are usig httpserver to create a socket.io server and not the app.listen

//health route helps to notify if the server is running or not. It can be used by load balancers to check the health of the server.