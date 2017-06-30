/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('configuration',['data-service']);
    angular.module('vendimia').requires.push('configuration');
})(angular);