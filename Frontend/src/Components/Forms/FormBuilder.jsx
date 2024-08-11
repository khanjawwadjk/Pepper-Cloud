import React, { useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Snackbar,
  SnackbarContent
} from "@mui/material";
import {CheckCircleOutlined, Warning, ErrorOutlineOutlined} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./FormBuilder.css";
import {createNewForm} from "../../Services/FormServices";
import { useNavigate } from "react-router-dom";

const objDetails = { FormTitle: "", Fields: [] };

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [showButtons, setShowButtons] = useState(false);
  const [inputFields, setInputFields] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [formDataOfUser, setFormDataOfUser] = useState(objDetails);

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

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setFormTitle(value === "" ? "Untitled Form" : value);
    console.log("value JK >>>", value)
        setFormDataOfUser((prev) => ({ ...prev, FormTitle: value }));
  };

  const handleInputButtonClick = (type) => {
    if (!inputFields.includes(type)) {
      setInputFields([...inputFields, type]);
      setFormDataOfUser((prev) => ({
        ...prev,
        Fields: [...prev.Fields, { Type: type, Title: "", Placeholder: "" }],
      }));
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedFields = formDataOfUser.Fields.map((item, index) =>
      index === selectedFieldIndex
        ? { ...item, [field]: value }
        : item
    );
    setFormDataOfUser((prev) => ({ ...prev, Fields: updatedFields }));
  };

  const handleEditTextField = (index) => {
    setSelectedFieldIndex(index);
  };

  const handleDeleteField = (index) => {
    const updatedFields = inputFields.filter((_, i) => i !== index);
    setInputFields(updatedFields);

    const updatedFormFields = formDataOfUser.Fields.filter((_, i) => i !== index);
    setFormDataOfUser((prev) => ({
      ...prev,
      Fields: updatedFormFields,
    }));

    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null);
    }
  };

  const handleSubmit = () =>{
    if(formDataOfUser.Fields.length > 0){
        handleSnackbarOpen("Form data saved successfully.", "success");
    }else{
        handleSnackbarOpen("Add inputs first.", "error");
    }
  }
  const handleCreateForm = async() => {
    console.log("Form submitted with data:", formDataOfUser);

    const createFormResult = await createNewForm(formDataOfUser);
    console.log("createFormResult >>>", createFormResult)
    console.log("createFormResult.data.status == true", createFormResult.data.status)
    if(createFormResult.data.status == true){
        handleSnackbarOpen("Form created successfully.", "success");
    }else{
        handleSnackbarOpen("Something went wrong !.", "error");
    }

    setTimeout(()=>{
      navigate('/Dashboard');
    }, 1000)
  };

  const renderEditor = () => {
    if (selectedFieldIndex === null) {
      return <Typography>Select a field to edit</Typography>;
    }

    if (selectedFieldIndex === 'Title') {
      return (
        <TextField
          label="Title"
          variant="standard"
          fullWidth
          onChange={handleChange}
        />
      );
    }

    const selectedFieldType = inputFields[selectedFieldIndex];
    const selectedField = formDataOfUser.Fields[selectedFieldIndex];

    return (
      <Box sx={{ padding: "20px", maxWidth: "300px", margin: "0 auto" }}>
        <Typography variant="h6" align="center" gutterBottom>
          {selectedFieldType}
        </Typography>

        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              label="Title"
              variant="standard"
              fullWidth
              value={selectedField?.Title || ""}
              onChange={(e) => handleInputChange(e, "Title")}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Placeholder"
              variant="standard"
              fullWidth
              value={selectedField?.Placeholder || ""}
              onChange={(e) => handleInputChange(e, "Placeholder")}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <h2>Create New Form</h2>
      <Paper
        elevation={3}
        sx={{
          width: "80%",
          padding: "10px",
          margin: "50px auto", // centers the Paper horizontally
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ borderRight: "1px solid #ccc", paddingRight: "20px" }}>
              <Typography variant="h4">
                {formTitle}
                <IconButton
                  size="small"
                  onClick={() => handleEditTextField("Title")}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Typography>
              {inputFields.map((type, index) => (
                <div className="inputFieldsDiv" key={index}>
                  <Paper
                    elevation={3}
                    style={{
                      padding: "5px",
                      paddingTop: "2px",
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                      marginTop: "30px",
                      marginLeft: "20px",
                      width: "50%",
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid item>
                        <DragIndicatorIcon
                          style={{ cursor: "grab", marginRight: "8px" }}
                        />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          label={type}
                          variant="standard"
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" aria-label="edit">
                          <EditIcon
                            onClick={() => handleEditTextField(index)}
                          />
                        </IconButton>
                        <IconButton color="error" aria-label="delete">
                          <DeleteIcon
                            onClick={() => handleDeleteField(index)}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              ))}
              <div className="buttonsDiv">
                <Button
                  variant="outlined"
                  onClick={() => setShowButtons(!showButtons)}
                >
                  {showButtons ? "Close Add Input" : "Add Input"}
                </Button>
                {showButtons && (
                  <div className="buttongroup">
                    <Button
                      variant="contained"
                      onClick={() => handleInputButtonClick("Text")}
                    >
                      Text
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleInputButtonClick("Number")}
                    >
                      Number
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleInputButtonClick("Email")}
                    >
                      Email
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleInputButtonClick("Password")}
                    >
                      Password
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleInputButtonClick("Date")}
                    >
                      Date
                    </Button>
                  </div>
                )}
              </div>
              <div className="submitDiv">
                <Button variant="contained" color="success" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ paddingLeft: "20px" }}>
              <Typography variant="h6">Form Editor</Typography>
              {renderEditor()}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Button variant="contained" color="success" onClick={handleCreateForm}>
        Create Form
      </Button>
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
    </>
  );
}
