/**
 * Created by Ben on 28/06/2017.
 */

((angular)=>{

    angular.module('data-service',['realtime']);
    angular.module('vendimia').requires.push('data-service');

})(angular);