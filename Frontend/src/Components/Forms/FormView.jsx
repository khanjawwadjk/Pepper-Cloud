import React, {useState, useEffect} from 'react';
import {getFormByFormId} from "../../Services/FormServices";
import { useParams } from 'react-router-dom';
import {Paper, Typography, Box, TextField, Button, Snackbar, SnackbarContent} from "@mui/material";
import {CheckCircleOutlined, Warning, ErrorOutlineOutlined} from "@mui/icons-material";


export default function FormView() {
  const { _id } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const getFormBuFormId = async() =>{
    console.log("_id >>>", _id);
    let response = await getFormByFormId(_id);
    setFormData(response.data.data); // Assuming response.data.data contains the form object
    console.log("response.data.data >>", response.data.data);
  }

  useEffect(()=>{
    getFormBuFormId();
  }, []);

  const handleChange = (e, fieldTitle) =>{
    const value = e.target.value;
    setFormValues(prevValues => ({
        ...prevValues,
        [fieldTitle]: value
      }));
  }

  const handleSubmit = () =>{
    console.log("Form Values:", formValues);
    handleSnackbarOpen("Form submitted. Thank you! Open console for form data", "success");
  }

  return (
    <div>
        <Paper
            elevation={3}
            sx={{
            width: "80%",
            padding: "10px",
            margin: "50px auto", // centers the Paper horizontally
        }}>
            {formData ? (
                <div>
              <Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {formData.FormTitle}
                </Typography>
                {formData.Fields && formData.Fields.map((field, index) => (
                    <TextField
                        label={field.Title}
                        variant="standard"
                        placeholder={field.Placeholder}
                        type={field.Type}
                        sx={{marginRight: "50px"}}
                        onChange={(e) => handleChange(e, field.Title)}
                    />
                ))}
              </Box>
              <br/>
              <br/>
              <Button variant="contained" color="success" onClick={handleSubmit}>
                Submit
              </Button>
              </div>
            ) : (
              <Typography variant="h6" align="center" gutterBottom>
                Loading...
              </Typography>
            )}
        </Paper>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SnackbarContent
          sx={{
            backgroundColor:
              snackbarSeverity === "error"
                ? "#f44336"
                : snackbarSeverity === "success"
                ? "#4caf50"
                : "#2196f3",
          }}
          message={
            <div style={{ display: "flex", alignItems: "center" }}>
              {snackbarSeverity === "success" && (
                <CheckCircleOutlined style={{ marginRight: "8px" }} />
              )}
              {snackbarSeverity === "warning" && (
                <Warning style={{ marginRight: "8px" }} />
              )}
              {snackbarSeverity === "error" && (
                <ErrorOutlineOutlined style={{ marginRight: "8px" }} />
              )}
              <span>{snackbarMessage}</span>
            </div>
          }
        />
      </Snackbar>
    </div>
  );
}
