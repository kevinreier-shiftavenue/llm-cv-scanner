# llm-cv-scanner
A Hackathon PoC for automated AI-powered CV scanning tool to match employers &amp; employees

# Docker Compose
Make sure to add the backend.env & flowise.env files to the envs directory at the root of the repo.
You can copy the templates to set up your environment. These files will be used by the docker compose.

run docker compose build to build the frontend and backend
run docker compose up -d to run the full application with all necessary components

## Mock API
Wiremock is used to simulate the Ashby API for development. The API endpoints and responses are defined according to the Ashby API Documentation. 
Wiremock will automatically start when running the compose file. For actual use with ashby, you can comment out the wiremock deployment in docker compose and define your ashby api url in the environment.
NOTE: Ashby API Authentication is yet to be implemented!!
