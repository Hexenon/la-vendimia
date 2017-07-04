/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('vendimia')
        .controller("mainController",['$scope', '$common', ($scope, $common)=>{
            $scope.$shared = $common.$shared;

            $scope.redirect = (location, _blank, _ask)=>{
                if (!_blank && !_ask) {
                    $common.$location.path(location).search('userId',null).search('clientId',null).search('articleId', null).search('salieId', null);
                } else if(!_ask){
                    $common.$window.open($common.$location.$$absUrl.replace($common.$location.$$path, location), '_blank');
                } else{
                    bootbox.dialog({
                        message: "<h3 class='text-info text-center'>Usted está saliendo de la pantalla actual, todos los cambios se perderán</h3><h2 class='text-primary text-center'>¿Está seguro?</h2>",
                        buttons: {
                            success: {
                                label: "Cancelar",
                                className: "btn-default"
                            },
                            danger: {
                                label: "Si, Salir",
                                className: "btn-primary",
                                callback: function() {
                                    $common.$location.path(location).search('userId',null).search('clientId',null).search('articleId', null).search('salieId', null);
                                    $scope.$apply();
                                }
                            }
                        }
                    });
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
    }).directive("digitalClock",function($timeout,dateFilter){
        return function(scope,element,attrs) {

            element.addClass('text-center');

            scope.updateClock = function(){
                $timeout(function(){
                    element.text(dateFilter(new Date(), 'yyyy/MM/dd hh:mm:ss'));
                    scope.updateClock();
                },1000);
            };

            scope.updateClock();

        };
    }).directive('enterSubmit', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterSubmit);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})(angular);