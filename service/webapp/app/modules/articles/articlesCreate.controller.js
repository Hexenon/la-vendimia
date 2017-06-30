/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('articles').controller('articlesCreateController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.randomCode = ()=>{
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        $scope.setRandomCode = ()=>{
            $scope.newArticle.code = $scope.randomCode();
        };

        $scope.newArticle = {
            code: $scope.randomCode()
        };

        if ($common.$location.search().articleId){
            let articleId = $common.$location.search().articleId;
            $dataService.findById({model:'articles', query:articleId, select: '-createdAt -__v -updatedAt'})
                .then((response)=>{
                    if (response.isValid){
                        $scope.newArticle = response.data;
                        $scope.editing = true;
                        $scope.$apply();
                    }

                })
                .catch((err)=>{
                    console.log(err);
                })
        }

        $scope.canSave = ()=>{
            return $scope.editing || $scope.newArticle.description && $scope.newArticle.model && $scope.newArticle.code && $scope.newArticle.price && $scope.newArticle.stock;
        };

        $scope.saveArticle = ()=>{
            $scope.status = null;
            $scope.result = null;
            $scope.saving = true;
            if (!$scope.editing) {
                $dataService.save('articles', $scope.newArticle)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Article successfully saved';
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Article already registered';
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
                $dataService.update('articles', $scope.newArticle)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Article successfully updated, redirecting in 3 seconds';
                            let total = 3;
                            $scope.editing = false;
                            $common.$interval(()=>{
                                total--;
                                $scope.result = 'Article successfully updated, redirecting in '+total+' seconds';
                            },1000);
                            $common.$timeout(()=>{
                                $common.$location.url($common.$location.path());
                            },3000);
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Article already registered';
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