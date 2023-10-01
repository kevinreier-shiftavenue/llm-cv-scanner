const express = require('express');
const router = express.Router();
import {getCVtoJobMatch} from '../openai/openai'


// Define a route to get all jobs
router.get('/', async (req, res) =>  {
    console.log("summarize endpoint called")
    let result = await getCVtoJobMatch(`${process.env.ASHBY_API_URL}/cvsamples-1.pdf`, "some example job desc")
    if(result.status == "Success"){
        res.status(200).json(result)
    }
    else if(result.status == "Error"){
        res.status(503).send(result);
    }

    res.status(500).send(result);

});

export default router;