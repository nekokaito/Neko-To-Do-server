const express = require('express');
const cors = require('cors');
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


app.use(express.json())

const uri =
  `mongodb+srv://${userName}:${userPass}@cluster0.vrlyepl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

