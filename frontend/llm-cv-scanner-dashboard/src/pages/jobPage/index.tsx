"use client"
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState,useEffect } from "react";

export default function CompanyPage () {
    const searchParams = useSearchParams()

  // get data by id
  // useEffect(() => {
  //   try {
  //     axios.get("http://localhost:5050/jobs#id").then((res) => {
  //       console.log(res.data);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

    const handleSorting = () => {
  // const data = [5,1,6,9,3];
  // const sort = data.sort((a, b) => a-b)
  // console.log(sort)
  // //[1,3,5,6,9]
    }
  
    return (
        <Grid container py={2} px={5} spacing={5}>
            <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                    <Button variant="contained">
                    <Link href={"/"} style={{textDecoration:"none",color:"white"}}>Back</Link>
                    </Button>
                </Box>
                <Typography sx={{fontWeight:"bold"}}>Job Details</Typography>
                <Button variant="contained">CV</Button>
            </Grid>  
            <Grid item xs={12}> 
                <Typography>{searchParams.get("jobPost")}</Typography>
            </Grid>
        </Grid>
    )
}