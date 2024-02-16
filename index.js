import express from 'express'
const app = express();
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http'
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import UserRoute from './routes/userRoute.js'
import path from 'path'




const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000"],
	}
})

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId == userId) &&
		users.push({ userId, socketId });
}

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
	return users.find(user => user.UserId === userId);
}
io.on("connection", (socket) => {
	console.log("connection is ready");
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id);
		io.emit('getUsers', users);

	})

	socket.on('sendMEssage', ({ senderId, receivedId, text }) => {
		const user = getUser(receivedId);
		io.emit("getMessage", { senderId, text });
	})



	socket.on("disconnect", (socket) => {
		console.log("user left...")
		removeUser(socket.id);
		io.emit('getUsers', users);
	})
})

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())


app.use("/api/chatApp", UserRoute);

dotenv.config();
const __dirname1 = path.resolve(); 
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname1, "/client/build")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
	})
} else {
	app.get("/", (req, res) => {
		res.send("ChatApp is running Successfully..");
	})
}


const PORT = process.env.PORT;


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	httpServer.listen(PORT, () => {
		console.log(`connection is establist with localhost:${PORT}`);
	})
}).catch((error) => {
	console.log(error);
})