/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('clients').config(function($routeProvider) {
        $routeProvider
            .when("/clients", {
                templateUrl : "app/modules/clients/clients.htm"
            })
            .when("/clients/create", {
                templateUrl : "app/modules/clients/clients-create.htm"
            });
    });
})(angular);