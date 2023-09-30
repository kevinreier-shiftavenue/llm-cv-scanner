import fetch from 'node-fetch'
const pdfParse = require('pdf-parse');
import OpenAI from 'openai';

const openai = new OpenAI();

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

function publish_cv_summary(summary: any){
    console.log("CV PUBLISHED!!!")
}

const SUMMARIZE_CV_PROMPT = `
Please provide me a summary of the following CV. 
The summary will describe the most important parts of the 
CV and what this person has accomplished in his or her career.
If the document is not a CV don't summarize it and instead return a short rejection reasoning
`

export async function summarizeCV(cv_url: string) {
    console.log("attempt connection to openai api")

    try{
        let pdf_buffer = await getPdf(cv_url);
        let pdf_text = await getPdfText(pdf_buffer)
        console.log("call openai api")
        let chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `${SUMMARIZE_CV_PROMPT}\n CV text:\n\n${pdf_text}` }],
            model: 'gpt-4-0613',
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
        return chatCompletion.choices[0];
    }
    catch(error: any){
        console.error(error)
        return {}
    }
    return {}
    
}

const COMPARE_PROMPT = `For this task you will receive two summaries, 
the first summary is the candidate CV summary and the second is a job description. 
Please analyze and understand each summary. After that please provide a number that 
determines how strong the candidate fits the job description, 
a verdict that says if the candidate is a Good, Medium or Bad fit for the role, 
and lastly a short reasoning why.
`

const example_cv_summ=`
Rachel Green is a highly accomplished academic with a PhD in English from the University of Illinois at Urbana-Champaign. Her dissertation focused on World War One and the emergence of literary modernism in the American South. She has extensive teaching experience, having served as a Composition Instructor, Literature Instructor, Coordinating Group Leader, Discussion Leader, and Teaching Assistant at the University of Illinois. Her research experience includes a role as a Doctoral Researcher and Research Assistant, with a focus on the literature of William Faulkner, Thomas Wolfe, and Tennessee Williams. She has several publications and has presented at numerous conferences. She has received several honors and awards, including the Jacob K. Javitz Fellowship and the Graduate College Dissertation Completion Award. She has also served in various professional and university service roles, including Managing Editor of the Southern Literary Journal and Graduate Mentor at The Career Center. She is a member of several professional associations, including the Modern Language Association and the American Literature Association.
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



export async function compareCVtoJobDesc(cv_summ: string, job_desc: string) {

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            { 
                role: 'user', 
                content: `${COMPARE_PROMPT}\nCV summary:\n\n${example_cv_summ}\n\nJob Description:\n\n${example_job_desc}` 
            }
        ],
        model: 'gpt-4-0613',
        temperature: 0.2,
        functions: [
            {
              "name": "save_cv_fit_evaluation",
              "description": "Process the evaluation of how well the candidate CV summary fits the Job Description",
              "parameters": {
                "type": "object",
                "properties": {
                  "fit_score": {
                    "type": "number",
                    "description": "A score of how well the summarized CV fits the Job description. Score mut be a number between 0.0 and 10.0"
                  },
                  "verdict": {
                    "type": "string",
                    "description": "The verdict in comprehensible words if the candidate is a good choice or not. Must be one of 'Perfect Fit', 'Good Fit', 'Medium Fit' or 'Bad Fit' based on fit_score"
                  },
                  "reasoning": {
                    "type": "string",
                    "description": "A short explanation of the decision why the candidate is a good fit or not."
                  }
                },
                "required": ["fit_score", "verdict", "reasoning"]
              }
            }
          ],
          "function_call": "auto"
      });
    return chatCompletion.choices[0];
}