import fetch from 'node-fetch'

async function query(data: any) {
    const response = await fetch(
        "http://localhost:3000/api/v1/prediction/81e55ac3-7987-4b9c-8cc5-957cab378012",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": "Hey, how are you?"}).then((response) => {
    console.log(response);
});