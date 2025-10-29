const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// simple_crud_user
// ZG7rhFURhWDjwET9
const uri =
	"mongodb+srv://simple_crud_user:ZG7rhFURhWDjwET9@cluster0.x65kkeb.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		const databaseName = client.db("simple_crud_db");
		const usersCollection = databaseName.collection("users");

		// User Get API
		app.get("/users", async (req, res) => {
			const cursor = usersCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/users/:id", async (req, res) => {
			const id = req.params.id;
			console.log("need this user", id);
			const query = { _id: new ObjectId(id) };
			const result = await usersCollection.findOne(query);
			res.send(result);
		});

		// User Post API
		app.post("/users", async (req, res) => {
			const newUserInfo = req.body;
			const result = await usersCollection.insertOne(newUserInfo);
			res.send(result);
		});

		// User Delete API
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await usersCollection.deleteOne(query);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
