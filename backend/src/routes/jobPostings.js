const express = require('express');
const router = express.Router();
import fetch from 'node-fetch'


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

// Define a route to get all jobs
router.get('/:jobPostingId', async (req, res) =>  {
    const jobPostingId = req.params.jobPostingId;
    console.log("try fetching job posting for jopPostingId "+jobPostingId+" from ashby")
    const url = process.env.ASHBY_API_URL
    var result = {};

    
    //TODO: from the database fetch the associated applications for the jobPostingId
    //for each application fetch the detailed data of the applicant from ashby as well
    //as the GPT4 matching result and return it as useful json data for FE use
    
    const associated_applicationIds = ["1","2"] //TODO get this from MongoDB


    const jobPosting_response = await fetch(url + "/jobPosting.info", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobPostingId: jobPostingId }),
    })
    const jobPosting_data = await jobPosting_response.json()

    
    if (jobPosting_data.success) {
        console.log("job posting pulled successfully")
        const jobPostingId = jobPosting_data.results.id
        const jobPosting_title = jobPosting_data.results.title
        const jobPosting_loc_name = jobPosting_data.results.locationName
        const jobPosting_desc = jobPosting_data.results.descriptionPlain

        result.id = jobPostingId
        result.title = jobPosting_title
        result.location = jobPosting_loc_name
        result.description = jobPosting_desc
    }
    else {
        const errorMessage = 'An error occurred while getting the job data for job ' + jobID + '!';
        const statusCode = 500; // Internal Server Error

        // Set the status code and send the error message
        res.status(statusCode).send(errorMessage);
    }
    let associated_applicationData = []

    for (let applicationId of associated_applicationIds) {
        // postings.push({id: jobPostingID, title: "some Title"})
        // Get Jobs Posting Info for all Postings of Job
        const application_response = await fetch(url + "/application.info", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: applicationId }), //TODO: Put something in request body??
        })
        const application_data = await application_response.json()
        if (application_data.success) {

            // //TODO: at this point get the GPT4 result for this application ID from the DB
            const gpt_res = {
                job_proximity: 1.0,
                verdict: 'Not a good match',
                explanation: 'The candidate has a strong background in Psychology and Data Analysis, not in Civil Engineering which is the main requirement for the job. The candidate does not have any experience in designing and managing construction projects, conducting feasibility studies and cost estimates for proposed projects, or ensuring compliance with building codes and safety regulations. They also lack experience with AutoCAD and other design software which is a requirement for the job. Therefore, the candidate does not match the job description.'
            }

            const application_candidateName = application_data.results.candidate.name
            const application_candidateEmail = application_data.results.candidate.primaryEmailAddress.value

            console.log("application Pulled successfully!")
            associated_applicationData.push(
                {
                 id: applicationId, 
                 candidateName: application_candidateName,
                 candidateEmail: application_candidateEmail,
                 gpt_result: gpt_res

                })
        }
        else {
            const errorMessage = 'An error occurred while getting the job posting data (id:' + applicationId + ')';
            const statusCode = 500; // Internal Server Error

            // Set the status code and send the error message
            res.status(statusCode).send(errorMessage);
        }
    }
    result.applications = associated_applicationData
    res.json({ result });
});


export default router;