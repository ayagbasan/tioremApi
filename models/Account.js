const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoleSchema = require('./Catalogue/Role');
const SourceSchema = require('./Catalogue/Source');

const AccountSchema = new Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        Username:
            {
                unique: true,
                type: String,
                required: [true, '`{PATH}` is required.'],
                maxlength: [15, '`The maximum length of {PATH}` field  must be less then {MAXLENGTH} characters'],
                minlength: [4, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
            },
        Roles: [RoleSchema.schema],
        Subscirptions: [SourceSchema.schema],
        Name:
            {
                type: String,
                default: null
            },
        Surname:
            {
                type: String,
                default: null
            },
        Email:
            {
                index: { unique: true },
                type: String,
                required: [true, '`{PATH}` is required.'],
            },
        Password:
            {
                type: String,
                required: [true, '`{PATH}` is required.'],
            },
        Notify:
            {
                type: Boolean,
                default: false
            },
        LastLogin:
            {
                type: Date,
                default: null
            },
        CreatedAt:
            {
                type: Date,
                default: Date.now
            },
        Active:
            {
                type: Boolean,
                default: true
            }
    }
);

module.exports = mongoose.model('account', AccountSchema);