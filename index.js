const express = require('express');
const cors = require('cors');
require("dotenv").config;
const port = 4000 || process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();






