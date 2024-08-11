const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  Type: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    default: '', // optional, you can choose to make it required if needed
  },
  Placeholder: {
    type: String,
    default: '', // optional, you can choose to make it required if needed
  }
});

// Schema for the entire form
const FormSchema = new Schema({
  FormTitle: {
    type: String,
  },
  Fields: {
    type: [FieldSchema],
    default: [],
  }
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
