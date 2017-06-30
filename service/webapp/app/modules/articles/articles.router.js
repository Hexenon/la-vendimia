/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('articles').config(function($routeProvider) {
        $routeProvider
            .when("/articles", {
                templateUrl : "app/modules/articles/articles.htm"
            })
            .when("/articles/create", {
                templateUrl : "app/modules/articles/articles-create.htm"
            });
    });
})(angular);