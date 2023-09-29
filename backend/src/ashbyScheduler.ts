import fetch from 'node-fetch'
import cron from 'node-cron'

export async function initCronJob(schedule: string) {
    cron.schedule(schedule, async () => {
        console.log('Query AST for new Job and Application Data');
      
        // Replace with the actual URL of the external service.
        const url = process.env.ASHBY_API_URL ? process.env.ASHBY_API_URL : "http://localhost:6060";
      
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
}

