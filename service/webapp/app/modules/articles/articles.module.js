/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('articles',['data-service']);
    angular.module('vendimia').requires.push('articles');
})(angular);