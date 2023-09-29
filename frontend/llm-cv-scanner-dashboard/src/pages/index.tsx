import { Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

export default function Home() {
  const [jobData, setJobData] = useState<any>([
    {
      id: 1,
      title: "Team Lead",
      location: "Munich",
      postings: [
        {
          id: "fa",
          title: "Frontend develop",
        },
        {
          id: "fb",
          title: "QA Automation",
        },
      ],
    },
    {
      id: 2,
      title: "Marketing Manager",
      location: "Munich",
      postings: [
        {
          id: "fs",
          title: "Sales",
        },
        {
          id: "fd",
          title: "Accounting",
        },
      ],
    },
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [jobId, setJobId] = useState<null | number>(null);

  // useEffect(() => {
  //   try {
  //     axios.get("http://localhost:5050/jobs ").then((res) => {
  //       console.log(res.data);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

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
      <Grid container>
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
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
