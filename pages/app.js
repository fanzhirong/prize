/**
 * Created by fanzr on 2017/1/3.
 */
angular.module('load.app',['ui.router','app.localSettings','app.httpServer','app.routerService'])
    .config(function ($stateProvider,$urlRouterProvider) {
        //$urlRouterProvider.otherwise('/prize');
        $stateProvider
            .state('app', {
                url: '/prize',
                templateUrl: 'pages/app.html',
                controller:"appCtrl"

            })

    })
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = [function (data) {
            var param = function (obj) {

                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            //TODO:2016.1.19 张志君 对于数组和对象的传输格式修改 将【】 改为. 未经过测试 留此据以供出错时查询
                            //fullSubName = name + '[' + subName + ']';
                            fullSubName = name + '.' + subName;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];
    })
    .controller("appCtrl",function ($scope,$interval,localSettings,httpServer,$rootScope,routerService) {
        //if(!$rootScope.load ){
        //    routerService.stateGo('load', {}, {location: 'replace'});
        //}

        //两个随机数作为随机种子 五位数
        var randNumFirst = 12345;
        var randNumSecond = 12345;

        //特别节目抽奖定时时间
        var otherPrizeTime = 100;
        var knowPrizeTime = 500;

        var timer; //抽奖定时器


        var effectiveCount = 0;//统计本次抽奖中当前已经出了多少中奖人数
        var effectiveArray ;

        var effectAward = 0;
        var infextAward = 0;

        var prizeSetCount = 0;//备份本次抽奖出多少中奖人数


        //读取服务器的获奖列表
        $scope.initData = {
            currentPrizeNum:'',
            currentPrizeName:'',
            currentId:'4',
            hasPrizeList:[],
            prizeList:{'len':0,'list':[],'subName':null},
            nextPrize:null,
            noPrizeList:[], //本地未中奖名单
            buttonArray:["三等奖","二等奖","一等奖","现金奖","特等奖","特别节目"],
            selectIndex:0,
            isOther:false,
            startDisabled:false,
            otherContent :null
        };

        localSettings.initSubPrizeList();

        //读取下次抽奖次数
        getCurrentStatue();
        /***
         *
         * 从服务器拉取参加抽奖的名单
         *
         */
        function getWorkerListFromServer (){
            //从网络获取人员总表和获奖名单
            httpServer.getAllWorkerList($scope.initData.currentId,function(data, status, headers, config){
                    console.log('拉取名单成功 ');
                    if(data.length > 0)
                    {
                        if(localSettings.workerList){
                            localSettings.workerList.length = 0;
                        }
                        else{
                            localSettings.workerList = [];
                        }
                        for(var i = 0; i<data.length;i ++){
                            localSettings.workerList.push(
                                {
                                    'name':data[i].name,
                                    'phoneNum':data[i].number,
                                    'department':data[i].department
                                });
                        }
                        getAwardListFromServer();
                    }
                    else{
                        localSettings.workerList.length = 0;
                    }

                },
                function(data, status, headers, config){
                    alert("网络错误");

                });
        };

        /***
         *
         * 从服务器拉取获奖名单
         *
         */
        function getAwardListFromServer(){
            httpServer.getAwardWorkerList(function(data, status, headers, config){

                    console.log('拉取获奖名单成功');
                    if(data.length >0){
                        if(localSettings.awardList){
                            localSettings.awardList.length = 0;
                        }
                        else{
                            localSettings.awardList = [];
                        }


                        for(var i = 0; i<data.length;i ++){
                                    localSettings.awardList.push(
                                        {
                                            'id':data[i].bigClass,
                                            'phoneNum':data[i].number,
                                            'subId':data[i].smallClass
                                        });
                            }
                    }
                    else{
                        localSettings.awardList.length = 0;
                    }

                    //页面显示中奖名单
                    $scope.initData.hasPrizeList = localSettings.getSubHasPrize($scope.initData.currentId);

                    console.log("拉取的数组 %o",$scope.initData.hasPrizeList);
                    //更新本地未中奖名单
                    $scope.initData.noPrizeList = localSettings.updateNoPrizeList();


                    $scope.initData.nextPrize = localSettings.getCurrentCount($scope.initData.currentId);


                    getSubAwardFromList();



                    if($scope.initData.nextPrize.currentCount == 0){
                        $scope.initData.startDisabled = true;
                        //startPages();
                    } else{
                        $scope.initData.startDisabled = false;
                        //stopPages();
                    }
                    $scope.initData.currentPrizeNum = localSettings.getPrizeName($scope.initData.currentId);
                    $scope.initData.currentPrizeName = localSettings.getSubPrizeName($scope.initData.nextPrize.subId);

                },
                function(data, status, headers, config){
                    alert("网络错误");
                });
        };



        function getSubAwardFromList(){
            var arr = [];
            var len = 0;
            if($scope.initData.hasPrizeList.length == 0){

                $scope.initData.prizeList.len = len;
            }
            else{
                for(var i=0;i<$scope.initData.hasPrizeList.length;i++){
                    len += $scope.initData.hasPrizeList[i].list.length;
                };
                for(var i=$scope.initData.hasPrizeList.length-1;i>=0;i--){
                    if($scope.initData.hasPrizeList[i].list.length>0) {
                        arr.length = 0;
                        arr = getNewestList($scope.initData.hasPrizeList[i].list);
                        break;
                    }
                };
                console.log("最低能够 %o",arr);
                    $scope.initData.prizeList.len = len;
                    $scope.initData.prizeList.subName = $scope.initData.hasPrizeList[i].subName;
                    $scope.initData.prizeList.list = arr;
            }

        }

        function getNewestList(arr){
            var array =[];
            if(arr.length == 0 ){
                array.length = 0;
            }
            else if(arr.length <=20)
            {
                for(var i = 0;i<arr.length;i++){
                    array.push(arr[i]);
                }
            }
            else if(arr.length > 20 && arr.length %20 == 0)
            {
                for(var i = arr.length-20;i <= arr.length-1;i++){
                    array.push(arr[i]);
                }
            }
            else
            {
                for(var i = arr.length-arr.length%20;i<arr.length;i++){
                    array.push(arr[i]);
                }
            }
            return array;
        }
        /***
         *
         * @param awarder
         * @param multi
         * 上传获奖名单到服务器
         */
        function updateAwardListToServer(awarder){
            var updateAwarderList = [];
            var oneAward ;

            for(var i =0 ;i<awarder.length;i++)
            {
                updateAwarderList.push({number:awarder[i].phoneNum,bigClass:awarder[i].id,smallClass:awarder[i].subId});
            }

            var list ={data:JSON.stringify(updateAwarderList)};
            console.log("上传的数组 %o",list);
            httpServer.postAwardWorkerList(list,function(data, status, headers, config){


                        $scope.initData.startDisabled = false;
                        getCurrentStatue();

                },
                function(data, status, headers, config){
                    alert("网络错误");
                });
        };
        /***
         *
         * 清空服务器中奖名单
         *
         */
        function resetAwardList(){
            httpServer.resetAllAwardList(function(data,status,headers,config){
                getCurrentStatue();
                alert("重新抽奖设置成功!");
            },function(data,status,header,config){
                alert("网络错误");
            });
        };


        /***
         *
         * @returns {{subId, currentCount}|*} 同步本地数据
         */
        function getCurrentStatue(){
            getWorkerListFromServer();
        };

        function getRnd (min,max){

            return parseInt(Math.random()*(max+min+1))%$scope.initData.noPrizeList.length;
        };
        function getOtherRand(min,max){
            return parseInt(Math.random()*(max+min+1))%$scope.initData.workerList.length;
        };

        /***
         * 显示特别节目的抽奖过程,未知奖项(防止现场额外增加的抽奖)
         */
        function getOtherRandNum(){

            var rndNum = getOtherRand(randNumFirst,randNumSecond);

            $scope.initData.otherContent =
            {
                'name':localSettings.workerList[rndNum].name,
                'phoneNum':localSettings.workerList[rndNum].phoneNum,
                'id':$scope.initData.currentId,
                "subId":$scope.initData.nextPrize.subId
            };
            document.getElementById("otherContent").innerHTML = "工号: "+localSettings.workerList[rndNum].phoneNum;
        }

        /***
         *
         * @param randNum 检查数字是否合法
         */
        function checkRandNum(randNum){


            var num = localSettings.subPrizeStyle[$scope.initData.nextPrize.subId].amount;
            console.log('开始检查数据'+num);

            var backResult;
            if($scope.initData.noPrizeList[randNum].department == localSettings.serionMap.INSTITUE){
                if(num%2 == 0)
                {
                    if(infextAward >=0 && (infextAward<parseInt(num/2)))
                    {
                        infextAward ++;
                        backResult = true;

                    }
                    else{
                        backResult = false;
                    }

                }
                else
                {
                    if(infextAward >=0 && (infextAward<(parseInt(num/2)+1)))
                    {
                        infextAward ++;
                        backResult = true;
                    }
                    else{
                        backResult = false;
                    }
                }

            }
            else
            {
                if(effectAward >=0 && effectAward<parseInt(num/2))
                {
                    effectAward ++;
                    backResult = true;

                }
                else{
                    backResult = false;
                }
            }

            return backResult;
        }

        function getNearList(){
            var arr = [];
            var len = 0;
            if($scope.initData.hasPrizeList.length == 0){
                    $scope.initData.prizeList.len = len;
            }
            else{
                for(var i=0;i<$scope.initData.hasPrizeList.length;i++){
                    len += $scope.initData.hasPrizeList[i].list.length;
                };
                for(var i=$scope.initData.hasPrizeList.length-1;i>=0;i--){
                    if($scope.initData.hasPrizeList[i].list.length>0) {
                        arr.length = 0;
                        arr = getNewestList($scope.initData.hasPrizeList[i].list);
                        $scope.initData.prizeList.subName = $scope.initData.hasPrizeList[i].subName;
                        break;
                    }
                };
                console.log("最低能够 %o",arr);
                    $scope.initData.prizeList.len = len;
                    $scope.initData.prizeList.list = arr;
            }
        };
        function delayDisplay(awarder){
            getSubAwardFromList();
        };

        /****
         * 所有已知品类抽奖
         */
        function getRandNum()
        {
            if(effectiveCount < prizeSetCount)
            {

                var prizeRndNum = getRnd(randNumFirst,randNumSecond);

                //查询中奖号码
                if(checkRandNum(prizeRndNum))
                {
                    var awarder = {'phoneNum':$scope.initData.noPrizeList[prizeRndNum].phoneNum,'id':$scope.initData.currentId,"subId":$scope.initData.nextPrize.subId};
                    //更新本地中奖名单并推送服务器

                    localSettings.awardList.push(awarder);
                    // localSettings.awardList.splice(0,0,awarder);

                    //获取一等奖中奖名单
                    $scope.initData.hasPrizeList = localSettings.getSubHasPrize($scope.initData.currentId);

                    //更新本地未中奖名单
                    $scope.initData.noPrizeList = localSettings.updateNoPrizeList();


                    delayDisplay(awarder);

                    $rootScope.$digest();

                    effectiveArray.push(awarder);
                    if(effectiveCount == (prizeSetCount-1)){
                        clearTimer();
                        updateAwardListToServer(effectiveArray);
                    }

                    effectiveCount++;
                }
                else{

                }
            }


        }
        function getTwoNum(){
            //统计子类获奖总数
            var subArray = [];
            for(var i = 0; i < localSettings.awardList.length;i++){
                if(localSettings.awardList[i].subId == $scope.initData.nextPrize.subId){
                    subArray.push(localSettings.awardList[i]);
                }
            }

            for(var i = 0 ;i <subArray.length;i++)
            {
                var number = subArray[i].phoneNum;
                for(var j = 0;j<localSettings.workerList.length;j++){
                    if(number == localSettings.workerList[j].phoneNum)
                    {
                        if(localSettings.workerList[j].department == localSettings.serionMap.INSTITUE){
                            infextAward ++;
                        }
                        else
                        {
                            effectAward ++;
                        }
                        break;
                    }
                }
            }
        }
        /***
         * 启动定时抽奖
         */
        function setTimer(){
            effectiveCount = 0;
            effectAward = 0;
            infextAward = 0;

            if(effectiveArray){
                effectiveArray.length = 0;
            }
            else{
                effectiveArray = [];
            }
            getTwoNum();
            console.log("服务器中奖数目"+effectAward+'--'+infextAward);
            timer = setInterval(getRandNum,knowPrizeTime);
        }

        /***
         * 结束定时抽奖
         */
        function clearTimer(){
            clearInterval(timer);
        };


        /**************************************************************
         *
         *  用户交互操作区  主要是按键操作
         *
         *************************************************************/

        /****
         *
         * @param val  选择奖品类别 分别为三等奖 二等奖...
         */
        $scope.itemClick = function(val)
        {
            $scope.initData.selectIndex = val-1;
            switch (val)
            {
                case localSettings.prizeMap.THIRDPRIZE:
                    $scope.initData.currentId = localSettings.idMap.THIRDSTYLE;
                    break;
                case localSettings.prizeMap.SECONDPRIZE:
                    $scope.initData.currentId = localSettings.idMap.SECONDSTYLE;
                    break;
                case localSettings.prizeMap.FIRSTPRIZE:
                    $scope.initData.currentId = localSettings.idMap.FIRSTSTYLE;
                    break;
                case localSettings.prizeMap.CASHPRIZE:
                    $scope.initData.currentId = localSettings.idMap.CASHSTYLE;
                    break;
                case localSettings.prizeMap.SPERICALPRIZE:
                    $scope.initData.currentId = localSettings.idMap.SPERICALSTYLE;
                    break;
                default :
                    $scope.initData.currentId = localSettings.idMap.OTHERSTYLE;
                    break;
            }
            getCurrentStatue();
        };

        /****
         * 开始抽奖按键操作
         */
        $scope.startClick=function()
        {
            $scope.initData.startDisabled = true;//在获取结果之前禁止启动下一次抽奖

            if($scope.initData.currentId == localSettings.idMap.OTHERSTYLE){
                $scope.initData.isOther = true;
                var music = document.getElementById("bgMusic");
                music.play();
                timer = setInterval(getOtherRandNum,otherPrizeTime);
            }
            else {
                prizeSetCount = $scope.initData.nextPrize.currentCount;
                setTimer();
            }


        };

        /***
         * 隐藏特别节目弹框
         */
        $scope.hideClick = function(){
            clearInterval(timer);
            $scope.initData.isOther = false;
            $scope.initData.startDisabled = false;
        }


        /***
         * 结束一次特别节目抽奖
         */
        $scope.stopClick = function(){
            clearInterval(timer);
            var music = document.getElementById("bgMusic");
            music.pause();
            $scope.initData.startDisabled = false;
            $scope.initData.isOther = false;
            if($scope.initData.otherContent){
                var awarder =
                [{
                    'phoneNum':$scope.initData.otherContent.phoneNum,
                    'id':$scope.initData.otherContent.id,
                    "subId":$scope.initData.otherContent.subId
                }];

                updateAwardListToServer(awarder);
            }
        }

        /*****
         * 重新设置抽奖,将中奖清零---此处谨慎操作
         */
        $scope.resetClick = function(){
            resetAwardList();
        }

    });