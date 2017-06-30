/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('clients',['data-service']);
    angular.module('vendimia').requires.push('clients');
})(angular);