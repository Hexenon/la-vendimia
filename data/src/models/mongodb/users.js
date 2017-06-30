/**
 * Created by Ben on 26/05/2017.
 */

let bcrypt = require('bcrypt');

let cryptPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

module.exports = (connection, mongoose) => {
    let usersSchema =  new mongoose.Schema({
        name: {
            type: String,
            required: true,
            index: true
        },
        lastName: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            index: {unique: true}
        },
        password: {
            type: String,
            required: true,
            set: cryptPassword
        },
        updatedAt: {
            type: Date,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },
        active: {
            type: Boolean,
            index: true,
            default: true
        }
    });

    let beforeUpdate = (next) => {
        let _this = this;
        _this.updatedAt = new Date();
        next(_this);
    };

    usersSchema.pre('save', beforeUpdate);

    usersSchema.pre('findOneAndUpdate', beforeUpdate);

    usersSchema.pre('findByIdAndUpdate', beforeUpdate);

    usersSchema.pre('update', beforeUpdate);



    return connection.model('users', usersSchema);
};