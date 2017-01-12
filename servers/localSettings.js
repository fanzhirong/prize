/**
 * Created by fanzr on 2017/1/3.
 */
angular.module('app.localSettings',[])
    .service('localSettings',function(){

        //奖项---奖品代码映射表
        var tAwardBatch =
        {
            "4": ["7","8"],
            "3": ["6","5"],
            "2": ["4","3","2"],
            "5": ["10","9"],
            '1': ["1"],
            "6": ["11"]
        };
        //人总表
        var workerList = [];

        //
        var sessionList = [];

       //获奖名单
        var awardList = [];

        //奖项类别
        var serionMap ={
            ELECTROL:"electroThermal",
            INSTITUE:"institute"
        };

        //奖项代码映射表
        var prizeMap={
            SPERICALPRIZE:5,
            FIRSTPRIZE:3,
            SECONDPRIZE:2,
            THIRDPRIZE:1,
            CASHPRIZE:4,
            OTHERPRIZE:6
        };

        //奖项代码映射表
        var idMap={
            SPERICALSTYLE:'1',
            FIRSTSTYLE:'2',
            SECONDSTYLE:'3',
            THIRDSTYLE:'4',
            CASHSTYLE:'5',
            OTHERSTYLE:'6'
        };

        //奖项名称映射表
        var prizeStyle = {
            '1':{"name":"特等奖","total":4},
            '2':{"name":"一等奖","total":15},
            '3':{"name":"二等奖","total":30},
            '4':{"name":"三等奖","total":140},
            '5':{"name":"现金奖","total":22},
            '6':{"name":"特别节目","total":20000}
        };

        //奖品名称映射表
        var subPrizeStyle = {
            '1':{"name":"iPhone 7","count":4,"amount":4,"list":[]},
            '2':{"name":"iPad mini 4","count":1,"amount":6,"list":[]},
            '3':{"name":"洗碗机","count":1,"amount":2,"list":[]},
            '4':{"name":"小米平衡车","count":1,"amount":7,"list":[]},
            '5':{"name":"金鸡","count":4,"amount":20,"list":[]},
            '6':{"name":"破壁机","count":2,"amount":10,"list":[]},
            '7':{"name":"飞利浦剃须刀","count":3,"amount":70,"list":[]},
            '8':{"name":"拍立得","count":3,"amount":70,"list":[]},
            '9':{"name":"2000元现金","count":1,"amount":2,"list":[]},
            '10':{"name":"1000元现金","count":2,"amount":20,"list":[]},
            '11':{"name":"敬请期待!","count":20000,"amount":20000,"list":[]}
        };

       function subIdToList(subId){

         var dic = subPrizeStyle[subId];
         if(dic.list){
             dic.list.length = 0;
         }else{
             dic.list =[];
         }
         var count = dic.count;
         var amount =  dic.amount;
         if(amount%count == 0){
             for(var i =0;i<count;i++){
                 dic.list.push(parseInt(amount/count));
             }
         }
         else{
             for(var i=0;i<count-1;i++){
                 dic.list.push(parseInt(amount/count));
             }
             dic.list.push(parseInt(amount/count)+1);
         }
       };
        var initSubPrizeList = function(){
            for(var i =1;i<12;i++){
                var subId = i.toString();
                subIdToList(subId);
            }
        }
        //获取各类奖项人数
       function getAwardAmount(id){
           var awardAmount = 0;
           for(var i=0;i<awardList.length;i++){
               if(awardList[i].id == id){
                   awardAmount ++;
               }
           }
           return awardAmount;
       }
        //获取各类奖品人数
        function getSubAwardAmount(subId){
            var subAwardAmount = 0;
            for(var i=0;i<awardList.length;i++){
                if(awardList[i].subId == subId){
                    subAwardAmount ++;
                }
            }
            return subAwardAmount;
        }

        var getPrizeName = function(Id){
            return  prizeStyle[Id].name;
        };

        var getSubPrizeName = function(subId){
            return subPrizeStyle[subId].name;
        };

        var getCurrentCount = function(id){

            var awardAmount =0;
            var awardSubAmount = 0;

            var allCount = prizeStyle[id].total;

            var subId ;
            var currentCount;



            var arr = tAwardBatch[id];

            awardAmount = getAwardAmount(id);

            if(awardAmount >= allCount){
                currentCount = 0;//奖品已经抽完
                subId = arr[arr.length-1];
            }
            else
            {
                switch (id){
                    case '4':
                    {

                        if(awardAmount < subPrizeStyle['7'].amount && awardAmount>=0)
                        {
                            subId = '7';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                        else
                        {
                            subId = '8';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                    }
                        break;
                    case '3':
                    {

                        if(awardAmount < subPrizeStyle['6'].amount && awardAmount>=0)
                        {
                            subId = '6';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                        else
                        {
                            subId = '5';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                    }
                        break;
                    case '2':
                    {

                        if(awardAmount < subPrizeStyle['4'].amount && awardAmount>=0)
                        {
                            subId = '4';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                        else if((awardAmount < subPrizeStyle['4'].amount+subPrizeStyle['3'].amount) && awardAmount>=subPrizeStyle['4'].amount)
                        {
                            subId = '3';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                        else
                        {
                            subId = '2';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                    }
                        break;
                    case '5':
                    {

                        if(awardAmount < subPrizeStyle['10'].amount && awardAmount>=0)
                        {
                            subId = '10';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                        else
                        {
                            subId = '9';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }
                    }
                        break;
                    case '1':
                        if(awardAmount < subPrizeStyle['1'].amount && awardAmount>=0)
                        {
                            subId = '1';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }else{

                        }
                        break;
                    default :
                        if(awardAmount < subPrizeStyle['11'].amount && awardAmount>=0)
                        {
                            subId = '11';
                            var countSubAmount = 0;
                            var preSubAmount = 0;
                            awardSubAmount = getSubAwardAmount(subId);
                            for(var i =0 ;i < subPrizeStyle[subId].list.length;i++){
                                preSubAmount = countSubAmount;
                                countSubAmount += subPrizeStyle[subId].list[i];
                                if(awardSubAmount >= preSubAmount && awardSubAmount < countSubAmount){
                                    currentCount = subPrizeStyle[subId].list[i];
                                    break;
                                }
                            }
                        }else{

                        }
                        break;
                }

            }

            return {"subId":subId,"currentCount":currentCount};

        }

        function getWorkerNameByPhone(phoneNum){
            var name ='';
            for(var i = 0; i<workerList.length;i ++){
                if(workerList[i].phoneNum == phoneNum)
                {
                    name = workerList[i].name;
                    break;
                }
            }
            return name;
        }

        var getSubHasPrize = function(id){
            var val = [];
            var backArr = [];


            if(awardList.length<=0){
                val.length = 0;

            }
            else{

                for(var i=0;i<awardList.length;i++){
                    if(awardList[i].id == id){
                        val.push(awardList[i]);
                    }
                }

            }

            if(val.length == 0){
                console.log("该子类没有中奖名单");
            }
            else
            {
                for (var j =0 ;j<tAwardBatch[id].length;j++){
                    var subId = tAwardBatch[id][j];
                    var subArr = [];
                    for(var i =0 ;i <val.length;i++){
                        if(val[i].subId == subId){
                            subArr.push({'phoneNum':val[i].phoneNum,'name':getWorkerNameByPhone(val[i].phoneNum)});
                        }
                    }

                    backArr.push({'subId':subId,'subName':subPrizeStyle[subId].name,'list':subArr});
                }
                console.log("该子类中奖名单 %o",backArr);

            }

            return backArr;
        }

        var updateNoPrizeList = function(){
          var noPrizeArr = [];

            for(var i=0;i < workerList.length; i++)
            {
                noPrizeArr.push(workerList[i]);
            }


            if(awardList.length > 0){
                for(var i=0;i < awardList.length ; i++)
                {
                    for(var j=0;j < noPrizeArr.length;j++){
                    if(awardList[i].phoneNum == noPrizeArr[j].phoneNum){
                        noPrizeArr.splice(j,1);
                    }
                }
                }
            }

            return noPrizeArr;
        };


        return{
            tAwardBatch:tAwardBatch,
            initSubPrizeList:initSubPrizeList,
            awardList:awardList,
            workerList:workerList,
            getSubHasPrize:getSubHasPrize,
            getPrizeName:getPrizeName,
            getSubPrizeName:getSubPrizeName,
            getCurrentCount:getCurrentCount,
            prizeMap:prizeMap,
            updateNoPrizeList:updateNoPrizeList,
            idMap:idMap,
            subPrizeStyle:subPrizeStyle,
            serionMap:serionMap
        }

    });