const Form = require('../models/formModels')

var formControllers = {
    getAllForms: (req, res)=>{
        try{
            Form.find({})
                .then(forms => {
                    res.status(200).send({
                        status: true,
                        message: "Forms retrieved successfully.",
                        data: forms
                    });
                })
                .catch(err => {
                    console.log(err);
                    errorResponse(res, 500, "Something went wrong while retrieving forms!", "getAllForms");
                });
        }catch(error){
            errorResponse(
                res,
                500,
                "Something went wrong !",
                "getFormByUserId"
              );
        }
    },
    getFormByUserId: async(req, res)=>{
        try{
            const formId = req.params.formId;
            const form = await Form.findById(formId);

            if (!form) {
                return res.status(404).json({ message: 'Form not found' });
            }

            res.status(200).send({
                status: true,
                message: "Data found successfully.",
                data: form
            })
        }catch(error){
            errorResponse(
                res,
                500,
                "Something went wrong !",
                "getFormByUserId"
              );
        }
    },

    createAForm: (req, res)=>{
        try{
            let requestBody = req.body;
            console.log("requestBody >>", requestBody);
            let FormTitle = requestBody.FormTitle;
            if(FormTitle == ''){
                FormTitle = 'Untitled Form'
            }
            if(requestBody.Fields.length == 0){
                return errorResponse(res, 401, "Please add Inputs first !", "createAForm")
            }

            const newForm = new Form({
                FormTitle: FormTitle,
                Fields: requestBody.Fields
              });

              newForm.save()
  .then(() => console.log('Form saved!'))
  .catch(err => console.log(err));

            res.status(201).send({
                status: true,
                message: "Form created successfully."
            })
        }catch(error){
            console.log("error", error.message)
            errorResponse(res, 500, "Something went wrong !", "createAForm")
        }
    },

    deleteAForm: async(req, res)=>{
        try{
            const form = await Form.findByIdAndDelete(req.params.formId);
            if (!form) {
                return res.status(404).send({ status: false, message: 'Form not found' });
            }

            res.status(200).send({ status: true, message: 'Form deleted successfully' });
        }catch(error){
            console.log("error", error.message)
            errorResponse(res, 500, "Something went wrong !", "deleteAForm")   
        }
    }
};


function errorResponse(res, statusCode, message, methodName) {
    res.status(statusCode).send({
      status: false,
      // methodName: methodName,
      message: message,
    });
  }

module.exports = formControllers;