"use client"
import { Grid, Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";

export default function CompanyPage () {
    const searchParams = useSearchParams()
    console.log(searchParams.get("jobName"))
    
    return (
        <Grid container py={2} px={5}>
            <Grid item xs={12}>
                <Typography>Job Details</Typography>
            </Grid>  
            <Grid item xs={12}> 
                <Typography>{searchParams.get("jobOpenings")}</Typography>
            </Grid>
        </Grid>
    )
}