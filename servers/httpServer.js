/**
 * Created by fanzr on 2017/1/4.
 */
angular.module('app.httpServer',['app.localSettings'])
    .service('httpServer',function($http,localSettings){

        var post = function (url, param, successCallBack,errorCallBack) {

            $http
                .post(url, param)
                .success(function (data, status, headers, config) {
                    successCallBack(data, status, headers, config);
                })
                .error(function (data, status, headers, config) {
                    errorCallBack(data, status, headers, config);
                })
            ;
        };

        var put = function (url, param, successCallBack,errorCallBack) {

            $http
                .put(url, param)
                .success(function (data, status, headers, config) {
                    successCallBack(data, status, headers, config);
                })
                .error(function (data, status, headers, config) {
                    errorCallBack(data, status, headers, config);
                });
        };

        var get = function (url, param, successCallBack,errorCallBack) {
          $http
              .get(url,param)
              .success(function (data, status, headers, config) {
                  successCallBack(data, status, headers, config);
              })
              .error(function (data, status, headers, config) {
                  errorCallBack(data, status, headers, config);
              })
        };

        this.getAllWorkerList =function(prizeIndex,successCallBack,errorCallBack){
            var url =  "http://ce4.midea.com:3002/lottery-years?query=allUser&bigClass="+prizeIndex;
            get(url,"",successCallBack,errorCallBack);
        };

        this.getAwardWorkerList = function(successCallBack,errorCallBack){
            get("http://ce4.midea.com:3002/lottery-years?query=lotteryData","",successCallBack,errorCallBack
                );
        };


        this.postAwardWorkerList = function(awardList,successCallBack,errorCallBack){

            put("http://ce4.midea.com:3002/lottery-years",awardList,successCallBack,errorCallBack);
        };

        this.resetAllAwardList=function(successCallBack,errorCallBack){
          var url= "http://ce4.midea.com:3002/lottery-years";
          post(url,{},successCallBack,errorCallBack);
        };

    });
