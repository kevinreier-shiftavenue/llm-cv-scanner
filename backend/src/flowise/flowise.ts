import fetch from 'node-fetch'

const SummaryPrompt = "Please provide me a summary of the CV. The summary will describe the most important parts of the CV and what this person has accomplished in his or her career."
const FitPrompt = "For this task you will receive to summaries, the first summary is the candidate summary and the second is a job description. Please analyze and understand each summary. After that please provide a number that determines how strong is the candidate to the job description, use the scale 0.0 to 10.0 where 0.0 represents no relation between the candidate and the job description and 10.0 represents a perfect job description for the candidate. Please return a JSON object with two keys, one key is called 'job_proximity' and the second key is called 'verdict'. Finally, please provide a brief summary why the candidate is or is not a good match for the job description. Please return a JSON object with three keys, one key is called 'job_proximity which contains resulting scale and the second key is called 'verdict' which says if the candidate is a good match or not and the third one is called 'explanation' which contains the summary of the analysis."

async function initFlowise() {
    const response = await fetch(
        "http://localhost:3000/api/v1/chatflows"
    );
    return response.json()
    .then((data) => data[0].id)
    .then((id) => {console.log(id); return id})
}

export async function queryFlowise(prompt: string, inputFile: any) {
    let formData = new FormData();
    if (inputFile) {
        formData.append("files", inputFile)
    }
    formData.append("question", prompt)
    formData.append("openAIApiKey", String(process.env.OPENAI_KEY))
    formData.append("stripNewLines", "true")
    formData.append("batchSize", "1")
    console.log("Querying Flowise")
    const flowiseChartID = await initFlowise();
    const response = await fetch(
        `http://localhost:3000/api/v1/prediction/${flowiseChartID}`,
        {
            method: "POST",
            body: formData as any,
        }
    );
    const result = await response.json();
    return result;
}
