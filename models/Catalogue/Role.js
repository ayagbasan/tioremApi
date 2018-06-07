const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    RoleName:
      {
        type: String,
        required: [true, '`{PATH}` is required.'],
        minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
      },
    CreatedAt:
      {
        type: Date,
        default: Date.now
      }, 
    UpdatedAt:
      {
        type: Date
      },
    Active:
      {
        type: Boolean,
        default: true
      }
  }
);


module.exports = mongoose.model('Role', RoleSchema);
