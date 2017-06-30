/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('configuration').config(function($routeProvider) {
        $routeProvider
            .when("/configuration", {
                templateUrl : "app/modules/configuration/configuration.htm"
            });
    });
})(angular);