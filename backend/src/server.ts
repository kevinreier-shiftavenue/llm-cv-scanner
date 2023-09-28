import Logger from './core/Logger';
import { port } from './config';
import app from './app';
const fetch = require('node-fetch');
import cron from 'node-cron'
import { config } from "dotenv";
config()
//import MongoDB requirements and create mongo client
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://felixwenzel:"+process.env.MONGO_PW+"@mll-team.lftkfar.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//TODO: use with await client.connect, await client.db(xxx) & await client.close


// Schedule a task to run every 10 minutes ('*/10 * * * *')
cron.schedule('*/10 * * * * *', async () => {
  console.log('Query AST for new Job and Application Data');

  // Replace with the actual URL of the external service.
  const url = process.env.ASHBY_API_URL ? process.env.ASHBY_API_URL : "";

  // Get Jobs List and Applications List
  fetch(url + "/job.list", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), //TODO: Put something in request body??
  })
    .then((response: any) => response.json())
    .then((data: any) => console.log(data))
    .catch((error: any) => console.error('Error fetching job list from Ashby:', error));

  fetch(url + "/application.list", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), //TODO: Put something in request body??
  })
    .then((response: any) => response.json())
    .then((data: any) => console.log(data))
    .catch((error: any) => console.error('Error fetching application list from Ashby:', error));

  // TODO: extract job IDs and Application IDs from response, compare IDs to Mongo DB. If Application ID is new -> pull CV and Job and do AI magic
  // Write result to DB in some json format
});




app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));