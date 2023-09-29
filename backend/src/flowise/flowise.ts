import fetch from 'node-fetch'

async function initFlowise() {
    const response = await fetch(
        "http://localhost:3000/api/v1/chatflows"
    );
    return response.json()
    .then((data) => data[0].id)
    .then((id) => {console.log(id); return id})
}


export async function query(inputFile: any, jobDescription: string) {
    let formData = new FormData();
    formData.append("files", inputFile)
    formData.append("question", "Does the CV fit this job description: " + jobDescription)
    formData.append("openAIApiKey", String(process.env.OPENAI_KEY))
    formData.append("stripNewLines", "true")
    formData.append("batchSize", "1")
    console.log("Querying Flowise")
    console.log(formData)
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
