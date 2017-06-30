/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('configuration').controller('configurationCreateController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.configuration = {};

        $scope.canSave = ()=>{
            return $scope.editing || $scope.configuration.financingRate && $scope.configuration.hitch && $scope.configuration.maxDeadline;
        };

        $dataService.on('save-configuration',(configuration)=>{
            $scope.currentConfiguration = configuration;
            $scope.currentConfigurationUpdatedAt = new Date();
            $scope.$apply();
        });

        $scope.saveConfiguration = ()=>{
            $scope.status = null;
            $scope.result = null;
            $scope.saving = true;
            if (!$scope.editing) {
                $dataService.save('configuration', $scope.configuration)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Configuration successfully saved';
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Configuration already registered';
                            } else {
                                $scope.status = result.error;
                            }
                        }
                        $scope.$apply();
                    })
                    .catch((err) => {
                        $scope.saving = false;
                        $scope.status = err.message;
                        $scope.$apply();
                    })
            }else{
                $dataService.update('configuration', $scope.configuration)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Configuration successfully updated, redirecting in 3 seconds';
                            let total = 3;
                            $scope.editing = false;
                            $common.$interval(()=>{
                                total--;
                                $scope.result = 'Configuration successfully updated, redirecting in '+total+' seconds';
                            },1000);
                            $common.$timeout(()=>{
                                $common.$location.url($common.$location.path());
                            },3000);
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Configuration already registered';
                            } else {
                                $scope.status = result.error;
                            }
                        }
                        $scope.$apply();
                    })
                    .catch((err) => {
                        $scope.saving = false;
                        $scope.status = err.message;
                        $scope.$apply();
                    })
            }
        };

        $scope.getCreatedAt = ()=>{
            return $common.$formatDate(new Date($scope.currentConfiguration.createdAt));
        };
        $dataService.find({model:'configuration',limit:1,sort:'-createdAt'})
            .then((result)=>{
                if (result.isValid && result.data.length > 0){
                    $scope.currentConfiguration = result.data[0];
                    $scope.currentConfiguration.createdAt = new Date($scope.currentConfiguration.createdAt);
                    $scope.$apply();
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }])
})(angular);