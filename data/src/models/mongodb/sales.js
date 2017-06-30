/**
 * Created by Ben on 26/05/2017.
 */


module.exports = (connection, mongoose) => {

    let saleSchema = new mongoose.Schema({
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'clients',
            required: true,
            index: true
        },
        articles: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'articles',
            required: true,
            index: true
        },
        monthlyPay: {
            type: Number,
            required: true,
            index: true
        },
        hitch: {
            type: Number,
            required: true,
            index: true
        },
        hitchBonification: {
            type: Number,
            required: true,
            index: true
        },
        deadline: {
            type: Number,
            required: true,
            index: true
        },
        total: {
            type: Number,
            required: true,
            index: true
        },
        totalCash: {
            type: Number,
            required: true,
            index: true
        },
        totalSale: {
            type: Number,
            required: true,
            index: true
        },
        status: {
            type: Boolean,
            default: true,
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

    saleSchema.pre('save', beforeUpdate);

    saleSchema.pre('findOneAndUpdate', beforeUpdate);

    saleSchema.pre('findIdAndUpdate', beforeUpdate);

    saleSchema.pre('update', beforeUpdate);



    return connection.model('sales', saleSchema);
};