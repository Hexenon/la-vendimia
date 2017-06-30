/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('users').config(function($routeProvider) {
        $routeProvider
            .when("/users", {
                templateUrl : "app/modules/users/users.htm"
            })
            .when("/login", {
                templateUrl : "app/modules/users/login.htm"
            })
            .when("/accountRecovery", {
                templateUrl : "app/modules/users/accountRecovery.htm"
            })
            .when("/users/create", {
                templateUrl : "app/modules/users/users-create.htm"
            })
            .when("/terms", {
                templateUrl : "app/modules/users/terms.htm"
            });
    });
})(angular);