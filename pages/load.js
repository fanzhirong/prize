/**
 * Created by fanzr on 2017/1/7.
 */

angular.module('load',['ui.router','app.routerService','load.app'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('load', {
                url: '/load',
                templateUrl: 'pages/load.html',
                controller:"loadCtrl"
            })

    })
    .config(function($urlRouterProvider){
        $urlRouterProvider.otherwise('/load');
    })
    .controller("loadCtrl",function ($scope,routerService,$rootScope) {

        $rootScope.load  = false;
        $scope.loadClick = function(){

            var password = document.getElementById("passwordInput").value;


            var sessionPassword = "meishao123";

            if(password == sessionPassword)
            {
                $rootScope.load = true;
                routerService.stateGo('app');
            }
            else{
                alert("密码错误,请重新输入!");
            }
        };

    });
