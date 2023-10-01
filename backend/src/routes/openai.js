const express = require('express');
const router = express.Router();
import {getCVtoJobEval} from '../openai/openai'


// Define a route to get all jobs
router.get('/', async (req, res) =>  {
    console.log("summarize endpoint called")
    let result = await getCVtoJobEval(`${process.env.ASHBY_API_URL}/cvsamples-1.pdf`, "some example job desc")
    // let result = await summarizeCV(`${process.env.ASHBY_API_URL}/cvsamples-1.pdf`)
    // console.log(result)
    res.send(result);
    // res.send("ok")
});

export default router;