/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('vendimia')
        .controller("mainController",['$scope', '$common', ($scope, $common)=>{
            $scope.$shared = $common.$shared;

            $scope.redirect = (location, _blank)=>{
                if (!_blank) {
                    $common.$location.path(location).search('userId',null).search('clientId',null).search('articleId', null);
                } else {
                    $common.$window.open($common.$location.$$absUrl.replace($common.$location.$$path, location), '_blank');
                }
            }
        }]).filter('numberFixedLen', function () {
            return function (n, len) {
                let num = parseInt(n, 10);
                len = parseInt(len, 10);
                if (isNaN(num) || isNaN(len)) {
                    return n;
                }
                num = '$'+num;
                while (num.length < len) {
                    num = ' '+num;
                }
                return num;
            };
        }).directive('initFocus', function() {
            let timer;

            return function(scope, elm, attr) {
                if (timer) clearTimeout(timer);

                timer = setTimeout(function() {
                    elm.focus();
                    elm.select();
                }, 0);
            };
        }).directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    });;
})(angular);