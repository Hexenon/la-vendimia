/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('vendimia')
        .controller("dashboardController",['$scope', '$common', ($scope, $common)=>{
            $common.$validate();
        }])
})(angular);