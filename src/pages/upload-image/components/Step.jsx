import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["", "", "", ""];

export default function HorizontalLinearAlternativeLabelStepper({
  documents,
  value,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={value} alternativeLabel>
        {documents?.map((label) => (
          <Step key={label?.name}>
            <StepLabel>{label?.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
