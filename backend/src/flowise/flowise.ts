import fetch from 'node-fetch'

let formData = new FormData();
formData.append("files", input.files[0])
formData.append("openAIApiKey", String(process.env.MONGO_PASSWORD))
formData.append("stripNewLines", "true")
formData.append("batchSize", "1")
formData.append("question", "Hey, how are you?")

async function query(formData: FormData) {
    const response = await fetch(
        "http://localhost:3000/api/v1/prediction/56519ca9-5cd2-4215-99d3-b428fd142d08",
        {
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

query(formData).then((response) => {
    console.log(response);
});