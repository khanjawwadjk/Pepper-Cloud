import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, Snackbar,
  SnackbarContent } from '@mui/material';
import "./DashboardLanding.css";
import { replace, useNavigate } from "react-router-dom";
import { getAllFormsDetails, deleteUserForm } from "../../Services/FormServices";
import {CheckCircleOutlined, Warning, ErrorOutlineOutlined} from "@mui/icons-material";


export default function DashboardLanding() {
  const [formsData, setFormsData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const navigate = useNavigate();

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const getAllForms = async () => {
    let response = await getAllFormsDetails();
    setFormsData(response.data.data);

    console.log("response.data >>", response.data);
  };

  useEffect(() => {
    getAllForms();
  }, []);

  const onView = (formId) => {
    navigate(`/Form/${formId}`)
  };

  const onEdit = async (formId) => {
    handleSnackbarOpen("Ohho!! We are Still in Progress.", "warning");
  };

  const onDelete = async(formId) => {
    console.log("Delete clicked for form:", formId);
    let response = await deleteUserForm(formId);

    if(response.data.status == true){
      handleSnackbarOpen("Form deleted successfully.", "success");
      getAllForms();
    }else{
        handleSnackbarOpen("Something went wrong !.", "error");
    }
  };

  return (
    <div>
      <h2>Welcome to Form.com</h2>
      <p className='subHeading'>
        <span className='subHeadingContent'>This is a simple form builder</span>
      </p>
      <Button variant="contained" color='success' onClick={() => navigate('/Form/Create')}>
        CREATE NEW FORM
      </Button>
      <br />
      <br />
      <hr style={{ width: '80%' }} />
      {formsData.length > 0 ? (
        <div className='cardsList'>
          {formsData.map((form) => (
            <Card sx={{ maxWidth: 280, margin: '20px auto' }} key={form._id}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {form.FormTitle}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => onView(form._id)}>
                  View
                </Button>
                <Button size="small" color="secondary" onClick={() => onEdit(form._id)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(form._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      ) : (
        <div className='formsList'>
          <h3>Forms</h3>
          <p>You have no forms created yet.</p>
        </div>
      )}

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
                ? "#4caf50" : snackbarSeverity === "warning"
                ? "#ffb74d"
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
