const express = require('express');
const cors = require('cors');
require("dotenv").config;
const port = 4000 || process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();



app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
   

  })
);


app.use(express.json())