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
            type: [{ article: mongoose.Schema.Types.ObjectId, quantity: Number } ],
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



    function beforeUpdate(next){
        let self = this;
        self.updatedAt = new Date();
        next(self);
    }

    function postSave(){
        let self = this;
        let articleModel = connection.model('articles');
        self.articles.forEach((article)=>{
             articleModel.findById(article.article,function(err, art){
                 if (art){
                     if (self.active) {
                         art.stock -= article.quantity;
                     }else{
                         art.stock += article.quantity;
                     }
                     art.save((err)=>{

                     })
                 }
             })
        });
    }


    function postUpdate() {
        let self = this;
        if (self.active === false) {
            let articleModel = connection.model('articles');
            self.articles.forEach((article) => {
                articleModel.findById(article.article, function (err, art) {
                    if (art) {
                        art.stock += article.quantity;
                        art.save((err) => {
                        })
                    }
                })
            });
        }
    }
    saleSchema.pre('save', beforeUpdate);

    saleSchema.pre('findOneAndUpdate', beforeUpdate);

    saleSchema.pre('findIdAndUpdate', beforeUpdate);

    saleSchema.pre('update', beforeUpdate);

    saleSchema.post('save', postSave);

    saleSchema.post('findOneAndUpdate', postUpdate);

    saleSchema.post('findIdAndUpdate', postUpdate);

    saleSchema.post('update', postUpdate);



    return connection.model('sales', saleSchema);
};