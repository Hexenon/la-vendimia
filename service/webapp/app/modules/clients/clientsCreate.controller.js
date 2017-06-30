/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('clients').controller('clientsCreateController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{

        $scope.newClient = {};

        if ($common.$location.search().clientId){
            let clientId = $common.$location.search().clientId;
            $dataService.findById({model:'clients', query:clientId, select: '-createdAt -__v -updatedAt'})
                .then((response)=>{
                    if (response.isValid){
                        $scope.newClient = response.data;
                        $scope.editing = true;
                        $scope.$apply();
                    }

                })
                .catch((err)=>{
                    console.log(err);
                })
        }

        $scope.canSave = ()=>{
            return $scope.editing || $scope.newClient.name && $scope.newClient.lastName && $scope.newClient.rfc;
        };

        $scope.saveClient = ()=>{
            $scope.status = null;
            $scope.result = null;
            $scope.saving = true;
            if (!$scope.editing) {
                $dataService.save('clients', $scope.newClient)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Bien Hecho. El cliente ha sido registrado correctamente';
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Cliente ya registrado';
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
                $dataService.update('clients', $scope.newClient)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Bien Hecho. El cliente ha sido actualizado correctamente, redirección en 3 segundos';
                            let total = 3;
                            $scope.editing = false;
                            $common.$interval(()=>{
                                total--;
                                $scope.result = 'Bien Hecho. El cliente ha sido registrado correctamente, redirección en '+total+' segundos';
                            },1000);
                            $common.$timeout(()=>{
                                $common.$location.url($common.$location.path());
                            },3000);
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Cliente ya registrado';
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
        }
    }])
})(angular);