const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SourceSchema = require('./Catalogue/Source');
const CategorySchema = require('./Catalogue/Category');
const TagSchema = require('./Catalogue/Tag');

var ArticleSchema = new Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        ArticleId : {
            type: Number,
            required:true
          },
        SourceId :{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Source',
            required: [true, '`{PATH}` is required.']
        },
        CategoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        Tags: [TagSchema.schema],
        ArticleUrl:{
            type: String,
            required: [true, '`{PATH}` is required.'],
            minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
          },
        SourceUrl:{
            type: String,
            required: [true, '`{PATH}` is required.'],
            minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
          },
        Title:{
            type: String,
            required: [true, '`{PATH}` is required.'],
            minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
          },
        SharingTitle:{
            type: String,
            required: [true, '`{PATH}` is required.'],
            minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
          },
        Body:{
            type: String
          },
        PubDate:
        {
            type: Date
        },
        DetailedDate:{
            type: String,
            required: [true, '`{PATH}` is required.']
          },
        VideoUrl:{
            type: String
          },
        ImageUrl:{
            type: String
          },
        FavoriteHits:
        {
            type: Number,
            default: 0
        },
        ReadHits:
        {
            type: Number,
            default: 0
        },
        LikeHits:
        {
            type: Number,
            default: 0
        },
        UnlikeHits:
        {
            type: Number,
            default: 0
        },
        Active:
        {
            type: Boolean,
            default: true
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
        Approved:
        {
            type: String,
            enum: ["Waiting Approve", "Approved","Not Approved"],
            default: "Waiting Approve"
        },
        ApprovedUserId :
        {             
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        },
        ApprovedAt :
        {
            type: Date
        }
    }
);


module.exports = mongoose.model('Article', ArticleSchema);