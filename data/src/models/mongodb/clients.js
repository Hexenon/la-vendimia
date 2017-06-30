/**
 * Created by Ben on 26/05/2017.
 */


module.exports = (connection, mongoose) => {
    let clientSchema =  new mongoose.Schema({
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
        maternalSurname: {
            type: String,
            index: true
        },
        rfc: {
            type: String,
            required: true,
            index: {unique: true}
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

    clientSchema.pre('save', beforeUpdate);

    clientSchema.pre('findOneAndUpdate', beforeUpdate);

    clientSchema.pre('findByIdAndUpdate', beforeUpdate);

    clientSchema.pre('update', beforeUpdate);



    return connection.model('clients', clientSchema);
};