/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('users',['data-service']);
    angular.module('vendimia').requires.push('users');
})(angular);