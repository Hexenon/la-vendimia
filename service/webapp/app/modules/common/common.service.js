/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('common')
        .factory('$common',[
            '$timeout','$location','$shared','$window', '$cookies', '$dataService','$rootScope','$compile','$interval','$sce',
            ($timeout, $location, $shared, $window, $cookies, $dataService, $rootScope,$compile,$interval,$sce)=>{
            let self = {};
            self.$timeout = $timeout;
            self.$location = $location;
            self.$shared = $shared;
            self.$window = $window;
            self.$cookies = $cookies;
            self.$validate = $validate;
            self.$formatDate = formatDate;
            self.$compile = $compile;
            self.$interval = $interval;
            self.$sce = $sce;

            function $validate(){
                if ($shared.user){
                    return;
                }
                let token = $cookies.get('lvs');
                if (token){
                    if (!$shared.user) {
                        $dataService.login({token: token}, (response) => {
                            if (response.isValid) {
                                $rootScope.$broadcast('login', response.user);
                                $rootScope.$emit('login', response.user);
                            } else {
                                $cookies.remove('lvs');
                                $location.path('login');
                            }
                            if(!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        });
                    }
                }else{
                    $location.path('login');
                }
            }

            function formatDate(date) {
                let monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];

                let day = date.getDate();
                let monthIndex = date.getMonth();
                let year = date.getFullYear();

                return day + ' ' + monthNames[monthIndex].substr(0,3) + ' ' + year;
            }


            return self;
        }]);

})(angular);