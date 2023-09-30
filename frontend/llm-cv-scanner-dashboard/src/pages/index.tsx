import { Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

export default function Home() {
  const [jobData, setJobData] = useState<any>([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [jobId, setJobId] = useState<null | number>(null);

  useEffect(() => {

    axios.get("http://localhost:5050/jobs ")
    .then((res) => {
      setJobData(res.data.jobs_response);
      console.log(res.data.jobs_response);
    })
    .catch(error => {
      console.log(error)
    });

  }, []);

  const handleExpand = (id: number) => {
    if (jobId === id) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Box width={"100%"} height={"100vh"} py={2} px={5}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={8}>
        <LogoDevIcon fontSize="large" />
        <CoPresentIcon fontSize="medium" />
      </Box>
      <Box >
        <h2>Jobs</h2>
      </Box>
      <Grid container>
        {jobData.length <= 0 ? <div>No Jobs to display</div> : <></>}
        {jobData.map((item: any, i: number) => (
          <Grid
            key={i}
            item
            xs={12}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            sx={{ border: "1px solid black", borderRadius: "15px" }}
            mt={2}
            p={2}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignContent={"center"}
              width={"100%"}
            >
              <Box display={"flex"} gap={2}>
                <Typography>Job Title: <span style={{fontWeight:"bold"}}>{item.title}</span></Typography>
                <Typography>Location:  <span style={{fontWeight:"bold"}}>{item.location}</span></Typography>
              </Box>
              <ExpandMoreIcon
                onClick={() => {
                  setJobId(i), handleExpand(i);
                }}
              />
            </Box>
            {isExpanded && jobId === i && (
              <Grid
                key={i}
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"left"}
                mt={2}
                p={2}
              >
              <Box width={"100%"} display={"flex"} gap={2}>
                {item.postings.map((jobPost: any) => (
                  <Link key={jobPost.id}
                    href={{
                      pathname: "/jobPage",
                      query: { jobPost: jobPost.id },
                    }}
                    style={{
                      color: "green",
                      textDecoration: "none"
                    }}
                  >
                    <Typography>{jobPost.title}</Typography>
                  </Link>
                ))}
              </Box>
              </Grid>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
