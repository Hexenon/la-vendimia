/**
 * Created by Ben on 28/06/2017.
 */

'use strict';
((angular)=>{
    angular.module('sales').controller('salesCreateController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.newSale = {
            folio: 'nuevo',
            hitch: 0,
            hitchBonification: 0,
            total: 0
        };
        $scope.articles = [];
        $scope.searchClient = searchClient;
        $scope.canSave = canSave;
        $scope.saveSale = saveSale;
        $scope.formatUserResult = formatUserResult;
        $scope.formatArticleResult = formatArticleResult;
        $scope.addArticle = addArticle;
        $scope.deleteArticle = deleteArticle;
        $scope.calculateTotal = calculateTotal;
        $scope.startNewSale = startNewSale;
        $scope.getDeadlineText = getDeadlineText;
        $scope.getPrice = getPrice;
        $scope.getHitch = getHitch;
        $scope.init = init;


        $scope.$on('deadlineFinished',()=>{
            let myArr=["minimal","flat","square"];
            let aCol=['red','green','aero','grey','orange','pink','purple','yellow','purple','yellow','blue']

            for (let i = 0; i < myArr.length; ++i) {
                for (let j = 0; j < aCol.length; ++j) {
                    // $('.icheck-minimal .blue.icheck input').iCheck({checkboxClass: 'icheckbox_minimal-blue',radioClass: 'iradio_minimal-blue'});
                    $('.icheck-' + myArr[i] + ' .' + aCol[j] + '.icheck input').iCheck({checkboxClass: 'icheckbox_' + myArr[i] + '-' + aCol[j],radioClass: 'iradio_' + myArr[i] + '-' + aCol[j]});
                }
            }

            $('input[name="month-deadline"]').on('ifClicked',
                function(e) {
                    $scope.newSale.deadline = this.value;
                    $scope.newSale.totalSale = $scope.newSale.totalCash * (1 + ($scope.configuration.financingRate * $scope.newSale.deadline) / 100);
                    $scope.newSale.monthlyPay = $scope.newSale.totalSale / this.value;
                    $scope.$apply();
                });
        });

        if ($common.$location.search().saleId){
            let saleId = $common.$location.search().saleId;
            $dataService.findById({model:'sales', query:saleId, select: '-createdAt -__v -updatedAt'})
                .then((response)=>{
                    if (response.isValid){
                        $scope.newSale = response.data;
                        $scope.editing = true;
                        $scope.$apply();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
        }

        $dataService.on('save-configuration',(configuration)=>{
            $scope.configuration = configuration;
            $scope.configuration.createdAt = new Date($scope.configuration.createdAt);
            $scope.$apply();
        });

        $scope.init();

        function searchClient(){
            console.log($scope.textClient);
        }

        function canSave(){
            let canSave = true;
            $scope.articles.every((a)=>{
                if (isNaN(a.quantity - a.stock)){
                    canSave = false;
                    return true;
                }
                return false;
            });
            if (!canSave){
                $scope.status = 'Hay un artículo con una cantidad inválida, verifique porfavor.'
            }
            if (!$scope.newSale.client ){
                $scope.status = 'No ha seleccionado un cliente';
            }
            if (!$scope.newSale.deadline > 0){
                $scope.status = 'No ha seleccionado un plazo de pago';
            }
            canSave = canSave && ($scope.editing || $scope.newSale.client && $scope.articles.length > 0 && $scope.newSale.deadline > 0 );

            if (canSave){
                $scope.status = null;
            }

            return canSave ;
        }

        function init(){

            $scope.clientSelector = $('#select-client');
            $scope.clientSelector.select2({
                placeholder: "Buscar cliente",
                minimumInputLength: 3,
                width: '100%',
                allowClear: true,
                formatNoMatches: function () { return "No se encontraron resultados"; },
                formatInputTooShort: function (input, min) { var n = min - input.length; return "Introduzca " + n + " letra" + (n == 1? "" : "s") + " porfavor"; },
                formatInputTooLong: function (input, max) { var n = input.length - max; return "Borre " + n + " letra" + (n == 1? "" : "s"); },
                formatSelectionTooBig: function (limit) { return "Solo puede seleccionar " + limit + " item" + (limit == 1 ? "" : "s"); },
                formatLoadMore: function (pageNumber) { return "<i class='fa fa-spinner fa-spin'></i>"; },
                formatSearching: function () { return "<i class='fa fa-spinner fa-spin'></i>"; },
                query: function(query){
                    if (query.term !== ''){
                        let data = {
                            results: []
                        };

                        $dataService.autocomplete({
                            model: 'clients',
                            query: query.term
                        })
                            .then((result)=>{
                                if (result.isValid){
                                    $scope.lastClients = result.data;
                                    if(!$scope.$$phase) {
                                        $scope.$apply();
                                    }
                                    result.data.forEach((user)=>{
                                        data.results.push({id:user._id,data:user})
                                    });
                                }
                                query.callback(data);
                            })
                            .catch((err)=>{
                                console.log(err);
                                query.callback(data);
                            })
                    }
                },
                formatResult: $scope.formatUserResult,
                formatSelection: $scope.formatUserResult,
                escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
            });
            $scope.clientSelector.on('change', function () {
                $scope.newSale.client = $scope.clientSelector.val();
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            $scope.articleSelector = $('#article-client');
            $scope.articleSelector.select2({
                placeholder: "Buscar artículo",
                minimumInputLength: 3,
                width: '100%',
                allowClear: true,
                formatNoMatches: function () { return "No se encontraron resultados"; },
                formatInputTooShort: function (input, min) { var n = min - input.length; return "Introduzca " + n + " letra" + (n == 1? "" : "s") + " porfavor"; },
                formatInputTooLong: function (input, max) { var n = input.length - max; return "Borre " + n + " letra" + (n == 1? "" : "s"); },
                formatSelectionTooBig: function (limit) { return "Solo puede seleccionar " + limit + " item" + (limit == 1 ? "" : "s"); },
                formatLoadMore: function (pageNumber) { return "<i class='fa fa-spinner fa-spin'></i>"; },
                formatSearching: function () { return "<i class='fa fa-spinner fa-spin'></i>"; },
                query: function(query){
                    if (query.term !== ''){
                        let data = {
                            results: []
                        };

                        $dataService.autocomplete({
                            model: 'articles',
                            query: query.term
                        })
                            .then((result)=>{
                                if (result.isValid){
                                    $scope.lastArticles = result.data;
                                    if(!$scope.$$phase) {
                                        $scope.$apply();
                                    }
                                    result.data.forEach((article)=>{
                                        data.results.push({id:article._id,data:article})
                                    });
                                }
                                query.callback(data);
                            })
                            .catch((err)=>{
                                console.log(err);
                                query.callback(data);
                            })
                    }
                },
                formatResult: $scope.formatArticleResult,
                formatSelection: $scope.formatArticleResult,
                escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
            });
            $scope.articleSelector.on('change', function () {
                $scope.article = $scope.articleSelector.val();
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            $dataService.find({model:'configuration',limit:1,sort:'-createdAt'})
                .then((result)=>{
                    if (result.isValid && result.data.length > 0){
                        $scope.configuration = result.data[0];
                        $scope.configuration.createdAt = new Date($scope.configuration.createdAt);
                        $scope.deadlineMonths = [];
                        for (let i=3; i <= $scope.configuration.maxDeadline; i+=3){
                            $scope.deadlineMonths.push(i);
                        }
                        $scope.$apply();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })

        }


        function addArticle() {
            if (!$scope.article) {
                $scope.status = 'Debe seleccionar al menos 1 artículo.';
                return;
            }
            let exist = $scope.articles.filter((a)=>{{return a._id === $scope.article}});
            if (exist.length > 0){
                if (exist[0].quantity < exist[0].stock) {
                    exist[0].quantity++;
                }
            }else {
                let article = $scope.lastArticles.filter((a) => {
                    {
                        return a._id === $scope.article
                    }
                });
                article[0].quantity = 1;
                article[0].maxPrice = $scope.getPrice(article[0].price, $scope.configuration.maxDeadline);
                article[0].hitch = $scope.getHitch(article[0].maxPrice);
                article[0].hitchBonification = article[0].hitch * (($scope.configuration.financingRate * $scope.configuration.maxDeadline)/100);
                article[0].total = article[0].maxPrice - article[0].hitch - article[0].hitchBonification;
                $scope.articles.push(article[0]);
            }
            $scope.article = null;
            $scope.articleSelector.select2("val", "");

        }

        function deleteArticle(article) {
            $scope.articles.splice(article, 1);
        }

        function calculateTotal(){
            $scope.newSale.total = 0;
            $scope.newSale.hitch = 0;
            $scope.newSale.hitchBonification = 0;
            $scope.articles.forEach((article)=>{
                if (article.quantity) {
                    $scope.newSale.hitch = article.hitch * article.quantity;
                    $scope.newSale.hitchBonification = article.hitchBonification * article.quantity;
                    $scope.newSale.total += (article.maxPrice * article.quantity) - $scope.newSale.hitch - $scope.newSale.hitchBonification;
                }
            });
            $scope.newSale.totalCash = 0;
            if ($scope.configuration) {
                $scope.newSale.totalCash = $scope.newSale.total / (1 + (($scope.configuration.financingRate * $scope.configuration.maxDeadline) / 100));
            }
            return $scope.newSale.total;
        }

        function saveSale(){
            $scope.status = null;
            $scope.result = null;
            $scope.saving = true;
            if (!$scope.editing) {
                $scope.newSale.articles = [];
                $scope.articles.forEach((a)=>{
                    $scope.newSale.articles.push(a._id);
                });
                $dataService.save('sales', $scope.newSale)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Sale successfully saved';
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Sale already registered';
                            } else {
                                $scope.status = result.error;
                            }
                        }
                        $scope.$apply();
                    })
                    .catch((err) => {
                        $scope.saving = false;
                        $scope.status = err.message;
                        $scope.$apply();
                    })
            }else{

            }
        }

        function formatUserResult(user) {
            return `${user.data.name}&nbsp;${user.data.lastName}&nbsp;${user.data.maternalSurname || '' }&nbsp;&nbsp;<span class="label label-primary"><strong>${user.data.rfc}</strong></span>`;
        }

        function formatArticleResult(user) {
            return `${user.data.description}&nbsp;-&nbsp;${user.data.model}&nbsp;&nbsp;<span class="label label-primary"><strong>${user.data.code}</strong>&nbsp;</span>
                &nbsp;&nbsp;<span class="label label-${user.data.stock > 0 ? 'success' : 'danger'}">&nbsp;stock:&nbsp;<strong>${user.data.stock}</strong></span>`;
        }

        function startNewSale(){
            bootbox.dialog({
                message: "<h2 class='text-info text-center'>Todo el progreso hasta ahora se perderá</h2><h3 class='text-danger text-center'>¿Está seguro?</h3>",
                buttons: {
                    success: {
                        label: "Cancelar",
                        className: "btn-default"
                    },
                    danger: {
                        label: "Si, comenzar de nuevo",
                        className: "btn-primary",
                        callback: function() {
                            $scope.newSale = { folio: 'nuevo',hitch: 0,hitchBonification: 0,total: 0};
                            $scope.articles= [];
                            $scope.status = null;
                            $scope.result = null;
                        }
                    }
                }
            });
        }

        function getPrice(price, _months){
            let factor = 1;
            if (_months){
                factor = (1 + (($scope.configuration.financingRate * _months) / 100)).toFixed(3);
            }
            return (price * factor).toFixed(2);
        }

        function getDeadlineText(months){
            if (months === 0){
                return $common.$sce.trustAsHtml(`<strong>PAGO DE CONTADO $ ${isNaN($scope.newSale.totalCash) ? 0: $scope.newSale.totalCash}</strong>`);
            }
            let totalSale = $scope.newSale.totalCash * (1 + ($scope.configuration.financingRate * months) / 100);

            let firstPart = `&nbsp;&nbsp;&nbsp;<strong>${months}</strong> ABONOS DE <strong>$ ${(isNaN(totalSale/months) ? 0 : totalSale/months).toFixed(2)}</strong>`;
            let secondPart = `&nbsp;&nbsp;&nbsp;TOTAL A PAGAR DE <strong>$ ${(isNaN(totalSale) ? 0 : totalSale).toFixed(2)}</strong>`;
            let thirdPart = `&nbsp;&nbsp;&nbsp;SE AHORRA <strong>$ ${(isNaN(($scope.newSale.total - totalSale)) ? 0 : ($scope.newSale.total - totalSale)).toFixed(2)}</strong>`;


            return $common.$sce.trustAsHtml(`${firstPart} ${secondPart} ${thirdPart}`);
        }

        function getHitch(price){
            return price * ($scope.configuration.hitch / 100);
        }

    }])
})(angular);