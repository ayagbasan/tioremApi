const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SourceSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,  
    SourceId : {
      type: Number,
      required:true
    },
    SourceName:
    {
      type: String,
      required: [true, '`{PATH}` is required.'],
      minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
    },
    Description:
    {
      type: String,
      required: [true, '`{PATH}` is required.'],
    },
    ImageUrl:
    {
      type: String,
      required: [true, '`{PATH}` is required.'],
    },
     
    SourceUrl:
    {
      type: String,
      required: [true, '`{PATH}` is required.'],
    },
    FollowerHits:
    {
      type: Number,
      default:0
    },
    Rating:
    {
      type: Number,
      default:0
    },
    CreatedAt:
    {
      type: Date,
      default: Date.now
    },
    UpdatedAt:
    {
      type: Date,
      default:null
    },
    Active:
    {
      type: Boolean,
      default: true
    }
  }
);


module.exports = mongoose.model('Source', SourceSchema);
