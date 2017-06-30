/**
 * Created by Ben on 08/06/2017.
 */


((angular)=>{
    let app = angular.module('vendimia');
    app.config(['$routeProvider', ($routeProvider)=>{
        $routeProvider
            .when("/", {
                templateUrl : "app/modules/sales/sales.htm"
            })
            .otherwise({redirectTo:'/login'});
    }]);


})(angular);