/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('users').controller('usersController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.user = null;
        $common.$validate();

        $scope.$on('login',(sender, user)=>{
            $common.$shared.user = user;
            $scope.user = user;
            $common.$shared.status = $dataService.status;
        });

        $common.$shared.status = $dataService.status;
        $dataService.on('disconnect',()=>{
            $common.$shared.status = $dataService.status;
            $scope.$apply();
        });

        $dataService.on('welcome',()=>{
            $common.$shared.status = $dataService.status;
            $scope.$apply();
        });
        $scope.logout = ()=>{
            delete $common.$shared.user;
            $common.$cookies.remove('lvs');
            $common.$location.path('login');
        }
    }])
})(angular);