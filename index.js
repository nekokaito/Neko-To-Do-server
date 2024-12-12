const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 4000;
const app = express();

const userName = process.env.USER_NAME;
const userPass = process.env.USER_PASS;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());

const uri = `mongodb+srv://${userName}:${userPass}@cluster0.vrlyepl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("neko-todo").collection("user");
const todoCollection = client.db("neko-todo").collection("todo");

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("DB Connected");

    // Get User
    app.get("/user", async (req, res) => {
      const query = { email: req.query.email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // Add User
    app.post("/add-user", async (req, res) => {
      const { email, displayName, photoURL, uid } = req.body;
      const user = await userCollection.insertOne({
        email,
        displayName,
        photoURL,
        uid,
      });
      res.send(user);
    });

    //------------------------- TO-DO CARD --------------------//

    // Add Todo
    app.post("/add-todo", async (req, res) => {
      const query = req.body;
      const todo = await todoCollection.insertOne(query);
      res.send(todo);
    });

    // User Todos
    app.get("/todos/:email", async (req, res) => {
      try {
        const { email } = req.params;
        if (!email) return res.status(400).send("Email is required.");
        const todos = await todoCollection.find({ email: email }).toArray();
        res.send(todos);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });
    

    // Delete Todo
    app.delete("/todos/:id", async (req, res) => {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const objectId = new ObjectId(id);

      const result = await todoCollection.deleteOne({
        _id: objectId,
        email: email,
      });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Todo not found or email mismatch" });
      }

      res.json({ message: "Todo deleted successfully" });
    });

    // Update Todo
    app.put("/todos/:id", async (req, res) => {
      const { id } = req.params;
      const { email } = req.body;

      const result = await todoCollection.updateOne(
        { _id: new ObjectId(id), email },
        { $set: { completed: true } }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Todo not found or email mismatch" });
      }

      res.send({ message: "Todo updated successfully" });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

dbConnect();

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
