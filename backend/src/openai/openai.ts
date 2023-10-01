import fetch from 'node-fetch'
const pdfParse = require('pdf-parse');
import OpenAI from 'openai';

const openai = new OpenAI();

const openai_model = 'gpt-3.5-turbo'

const SYSTEM_CONFIG_PROMPT = `
For this task you will receive both a candidate CV and a job description. 
Please analyze and understand each. After that please provide a number that 
determines how strong the candidate fits the job description based on their skills and experience and the 
requirements stated in the job description and a short reasoning behind the score.
The matching should be extremely strict and for a candidate to receive a score higher than 6.0 
they should fit the description almost perfectly and match at least some of the fixed requirements like degrees or certificates.
If the provided CV Text is not really a CV don't match it against the job description 
and instead return a score of 0.0 together with a short rejection reasoning.
`

const SUMMARIZE_CV_PROMPT = `
Please provide me a summary of the following CV. 
The summary will describe the most important parts of the 
CV and what this person has accomplished in his or her career.
If the document is not a CV don't summarize it and instead return a short rejection reasoning
`

const COMPARE_PROMPT = `For this task you will receive two summaries, 
the first summary is the candidate CV summary and the second is a job description. 
Please analyze and understand each summary. After that please provide a number that 
determines how strong the candidate fits the job description, 
a verdict that says if the candidate is a Good, Medium or Bad fit for the role, 
and lastly a short reasoning why.
`

const example_job_desc= `
Title: Professor of English Literature

Department: Department of English

Reports To: Chair, Department of English

Position Summary:
The Professor of English Literature will be responsible for fostering a rich learning environment conducive to student growth and satisfaction in the area of English Literature. They will contribute to the academic community through high-quality teaching, research, and service.

Primary Responsibilities:

Teaching:

Design, develop, and deliver engaging coursework in English Literature.
Lead lectures, discussions, and other class-related activities.
Evaluate student performance and provide constructive feedback.
Mentor and advise students on academic and career goals.
Stay updated on pedagogical methods and technologies to enhance the learning experience.
Research:

Conduct original research in the field of English Literature.
Publish findings in reputable academic journals and present at professional conferences.
Pursue external funding opportunities to support research initiatives.
Collaborate with colleagues within and outside the institution on research projects.
Service:

Participate in departmental and institutional committees.
Contribute to curriculum development and program assessment.
Engage with the broader academic and professional communities.
Promote the department and the institution through public engagement and professional activities.
Qualifications:

Ph.D. in English Literature or a closely related field from an accredited institution.
A proven record of scholarship, teaching, and service in higher education.
Strong commitment to promoting diversity, equity, and inclusion in academia.
Excellent communication and interpersonal skills.
Ability to work collaboratively with faculty, staff, and students.
Application Process:

Interested candidates should submit a cover letter, curriculum vitae, teaching philosophy, research statement, and contact information for three professional references through the institution's online application system.

Review of applications will begin on [Insert Date] and will continue until the position is filled. The anticipated start date is [Insert Date].

The institution is an equal opportunity employer and welcomes applications from candidates of all backgrounds.
`

async function getPdf(url: string) {
    try {
        // Fetch PDF data from the external URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Convert the response data to a Buffer
        const dataBuffer = await response.buffer();
        console.log("successfully fetched pdf buffer")
        return dataBuffer;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
}

async function getPdfText(pdf: any) {
    const data = await pdfParse(pdf)
    // console.log(data.text)
    return data.text;
}

function evaluateMatch(score: number): string {
    if (score < 2.5) {
        return 'Bad Match';
    } else if (score <= 5.0) {
        return 'Medium Match';
    } else if (score <= 7.5) {
        return 'Good Match';
    } else {
        return 'Perfect Match';
    }
}

export async function summarizeCV(cv_url: string) {
    console.log("attempt connection to openai api")

    try{
        let pdf_buffer = await getPdf(cv_url);
        let pdf_text = await getPdfText(pdf_buffer)
        console.log("call openai api")
        let chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `${SUMMARIZE_CV_PROMPT}\n CV text:\n\n${pdf_text}` }],
            model: openai_model,
            temperature: 0.2,
            "functions": [
                {
                    "name": "compare_cv_summary",
                    "description": "Use the CV summary to further process it",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "summary": {
                                "type": "string",
                                "description": "The Summary of the given CV in text form"
                            }
                        },
                        "required": ["summary"]
                    }
                },
                {
                    "name": "reject_noncv_document",
                    "description": "Reject Non-CV documents",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "rejection_reason": {
                                "type": "string",
                                "description": "The reason the text was rejected"
                            }
                        },
                        "required": ["rejection_reason"]
                    }
                },
            ],
            "function_call": "auto"
        });
        return chatCompletion;
    }
    catch(error: any){
        console.error(error)
        return {}
    }
    return {}
    
}

export async function getCVtoJobMatch(cv_url: string, job_desc: string){
    console.log("try doing CV eval in one query")
    try{
        let pdf_buffer = await getPdf(cv_url);
        let pdf_text = await getPdfText(pdf_buffer)
        console.log("call openai api")
        let chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_CONFIG_PROMPT},
                { role: 'user', content: `CV text:\n\n${pdf_text}\n\nJob Description:\n\n${example_job_desc}` }
            
            ],
            model: openai_model,
            temperature: 0.2,
            functions: [
                {
                  "name": "save_cv_fit_evaluation",
                  "description": "Process the evaluation of how well the candidate CV fits the Job Description",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "fit_score": {
                        "type": "number",
                        "description": "A score of how well the CV fits the Job description. Score mut be a number between 0.0 and 10.0"
                      },
                      "reasoning": {
                        "type": "string",
                        "description": "A short explanation of the decision why the candidate is a good fit or not."
                      }
                    },
                    "required": ["fit_score", "reasoning"]
                  }
                }
              ],
              "function_call": {"name": "save_cv_fit_evaluation"}
        }) as OpenAI.Chat.ChatCompletion;

        var function_call = chatCompletion.choices[0].message.function_call || undefined
        if(function_call){
            if(function_call.name == "save_cv_fit_evaluation"){
                console.log(`Document ${cv_url} was evaluated and returned the required format.`)
                let function_args = JSON.parse(function_call.arguments)

                return function_args
            }
            else{
                console.log("OpenAI response does not contain a mapped function call")
                return {
                    status: `${function_call} is not a valid function call`,
                    message: chatCompletion.choices[0].message
                }
            }
        }
        else{
            console.log("No function_call in response object of OpenAI CV Summary Response")
            return {
                status: `No function call present in message`,
                message: chatCompletion.choices[0].message
            }
        }

        return {};

    }
    catch(error){
        console.error(error)
        return {
            status: `Error while evaluating CV`,
            error: error
        }
    }
}
