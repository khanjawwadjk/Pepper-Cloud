import axios from "axios";

const APIBaseURL = 'http://localhost:8000/';


export const getAllFormsDetails = async() =>{
    return await axios.get(APIBaseURL+`Form/All`)
}

export const getFormByFormId = async(formId) =>{
    return await axios.get(APIBaseURL+`Form/FormById/${formId}`)
}

export const createNewForm = async(formDataOfUser) =>{
    return await axios.post(APIBaseURL+`Form/Create`, formDataOfUser)
}

export const deleteUserForm = async(formId) =>{
    return await axios.put(APIBaseURL+`Form/Delete/${formId}`)
}