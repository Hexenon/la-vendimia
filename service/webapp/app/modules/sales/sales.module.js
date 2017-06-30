/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('sales',['data-service']);
    angular.module('vendimia').requires.push('sales');
})(angular);