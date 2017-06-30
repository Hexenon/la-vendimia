/**
 * Created by Ben on 26/05/2017.
 */


module.exports = (connection, mongoose) => {
    let articleSchema =  new mongoose.Schema({
        description: {
            type: String,
            required: true,
            index: true
        },
        model: {
            type: String,
            required: true,
            index: true
        },
        code: {
            type: String,
            required: true,
            index: {unique:true}
        },
        price: {
            type: Number,
            required: true,
            index: true
        },
        stock: {
            type: Number,
            required: true,
            index: true
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

    articleSchema.pre('save', beforeUpdate);

    articleSchema.pre('findOneAndUpdate', beforeUpdate);

    articleSchema.pre('findByIdAndUpdate', beforeUpdate);

    articleSchema.pre('update', beforeUpdate);



    return connection.model('articles', articleSchema);
};