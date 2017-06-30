/**
 * Created by Ben on 26/05/2017.
 */


module.exports = (connection, mongoose) => {
    let configurationSchema =  new mongoose.Schema({
        financingRate: {
            type: Number,
            required: true
        },
        hitch: {
            type: Number,
            required: true
        },
        maxDeadline: {
            type: Number,
            required: true
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

    configurationSchema.pre('save', function(next) {
        this.updatedAt = new Date();
        next();
    });

    return connection.model('configuration', configurationSchema);
};