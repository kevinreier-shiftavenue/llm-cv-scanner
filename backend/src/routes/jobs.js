const express = require('express');
const router = express.Router();


//TODO: Pull info

// Define a route to get all jobs
router.get('/', (req, res) => {
    res.send('Get all jobs');
});

// Define a route to get a specific job by ID
router.get('/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    res.send(`Get job with ID: ${jobId}`);
});

module.exports = router;