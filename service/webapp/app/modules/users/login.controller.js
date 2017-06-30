/**
 * Created by Ben on 28/06/2017.
 */

((angular)=>{

    angular.module('users')
        .controller('loginController',['$scope','$common','$dataService',($scope, $common, $dataService)=>{
            if ($common.$shared.user){
                return $common.$location.path('');
            }

            $scope.user = {
            };

            $scope.login = ()=>{
                $scope.status = null;
                $dataService.login($scope.user, (response)=> {
                    if (response.isValid) {
                        let expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $common.$cookies.put('lvs', response.session.token, {expires: expireDate, path: '/'});
                        $scope.$broadcast('login', response.user);
                        $scope.$emit('login', response.user);
                        $common.$location.path('');
                    } else {
                        $scope.status = response.error;
                    }
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        }]);

})(angular);