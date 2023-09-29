import { Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CoPresentIcon from '@mui/icons-material/CoPresent';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import Link from "next/link";
import { useState,useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [jobData,setJobData] = useState<any>()

  const [isExpanded, setIsExpanded] = useState(false);
  const [jobId, setJobId] = useState<null | number>(null);
  
  useEffect(() => {
    // axios.get()
  });

  const handleExpand = (id: number) => {
    if (jobId === id) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Box width={"100%"} height={"100vh"} py={2} px={5}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={8}>
        <LogoDevIcon fontSize="large"/>
        <CoPresentIcon fontSize="medium"/>
      </Box>
      <Grid container>
        {jobData.map((item:any, i:number) => (
          <Grid
            key={i}
            item
            xs={12}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            sx={{ border: "1px solid black",borderRadius:"15px" }}
            mt={2}
            p={2}
          >
            <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
              <Typography>{item.jobName}</Typography>
              <ExpandMoreIcon
              onClick={() => {
                setJobId(i), handleExpand(i);
              }}
            />
            </Box>
            {isExpanded && jobId === i && (
              <Box display={"flex"}>
                <Box display={"flex"}>                 
                  <Link
                    href={{
                      pathname: "/jobPage",
                      query: { jobName: item.jobName,jobOpenings:item.jobOpenings },
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "green",
                    }}
                  >
                    <Typography>{item.jobOpenings}</Typography>
                  </Link>
                </Box>
              </Box>
            )}         
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
