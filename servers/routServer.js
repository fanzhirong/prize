/**
 * Created by fanzr on 2017/1/7.
 */
angular.module('app.routerService', [])
    .factory('routerService', function ($state) {
        //state go function
        var stateGo = function (to, params, options) {
            $state.go(to, params, options)
        };
        return {
            stateGo: stateGo
        };

    });
