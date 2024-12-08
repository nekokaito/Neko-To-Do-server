const express = require("express");
const cors = require("cors");
require("dotenv").config;
const port = 4000 || process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const userName = process.env.USER_NAME;
const userPass = process.env.USER_PASS;

app.use(
  cors({
    origin: "http://localhost:5173/",
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


const userCollection = client.db('neko-todo').collection('user');
const todoCollection = client.db('neko-todo').collection('todo');

const dbConnect = async () => {
  try {
    client.connect();
    console.log("DB Connected");

    // Getting User

    app.get("/user", async (req, res) => {
      const query = { email: req.params.email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });


    // Adding User
    app.post("/add-user", async (req, res) => {
      const { email, displayName, photoURL, uid } = req.body;

      
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      try {
        
        const result = await userCollection.insertOne({
          email,
          displayName,
          photoURL,
          uid,
        });

        res.status(201).json({ message: "User added successfully", result });
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });






   // Try Ends Here


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
  console.log(port);
});
