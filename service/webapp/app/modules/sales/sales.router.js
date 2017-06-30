/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('sales').config(function($routeProvider) {
        $routeProvider
            .when("/sales", {
                templateUrl : "app/modules/sales/sales.htm"
            })
            .when("/sales/create", {
                templateUrl : "app/modules/sales/sales-create.htm"
            });
    });
})(angular);