const express = require('express');
const router = express.Router();
import fetch from 'node-fetch'


//TODO: Pull info

// Define a route to get all jobs
router.get('/', async (req, res) =>  {
    console.log("try fetching jobs from ashby")
    var job_ids = ["1"]  //TODO: get all job ids from DB
    var jobs_response = []
    const url = process.env.ASHBY_API_URL
    for (let jobID of job_ids) {
        // Get Job info by DB List of Jobs that have Postings with Applications
        const job_response = await fetch(url + "/job.info", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: jobID }), //TODO: Put something in request body??
        })
        const job_data = await job_response.json()
        if (job_data.success) {
            console.log("job pulled successfully")
            const job_title = job_data.results.title
            const job_loc_name = job_data.results.location.name
            let job_posting_ids = job_data.results.jobPostingIds
            let postings = []

            for (let jobPostingID of job_posting_ids) {
                // postings.push({id: jobPostingID, title: "some Title"})
                // Get Jobs Posting Info for all Postings of Job
                const jobPosting_response = await fetch(url + "/jobPosting.info", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobPostingId: jobPostingID }), //TODO: Put something in request body??
                })
                const jobPosting_data = await jobPosting_response.json()
                if (jobPosting_data.success) {
                    console.log("jobPosting Pulled successfully!")
                    const jobPosting_title = jobPosting_data.results.title
                    postings.push({ id: jobPostingID, title: jobPosting_title })
                }
                else {
                    const errorMessage = 'An error occurred while getting the job posting data (id:' + jobPostingID + ') for job ' + jobID + '!';
                    const statusCode = 500; // Internal Server Error

                    // Set the status code and send the error message
                    res.status(statusCode).send(errorMessage);
                }
            }

            jobs_response.push({
                id: jobID,
                title: job_title,
                location: job_loc_name,
                postings: postings
            })
        }
        else {
            const errorMessage = 'An error occurred while getting the job data for job ' + jobID + '!';
            const statusCode = 500; // Internal Server Error

            // Set the status code and send the error message
            res.status(statusCode).send(errorMessage);
        }
            

    }
    res.json({ jobs_response });
});



// Define a route to get a specific job by ID
router.get('/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    res.send(`Get job with ID: ${jobId}`);
});

export default router;