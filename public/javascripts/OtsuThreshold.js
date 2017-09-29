/**
 * Created by bgh29 on 2017-09-11.
 */
(function() {
    var OtsuJS;

    OtsuJS = {};

    OtsuJS.threshold = function (imgData) {
        var histogram = new Array(256);
        console.log(histogram.length);
        var totalNum = imgData.data.length *imgData.data[0].length;
        var totalSum;

        for(var i=0 ; i<histogram.length ; i++)
            histogram[i]=0;

        for(var i=0 ; i<imgData.data.length ; i++){
            for(var j=0 ; j<imgData.data[0].length ; j++){
                histogram[imgData.data[i][j]]++;
            }
        }
        console.log("histogram", histogram);
        totalSum = 0;
        for(var i=0; i<histogram.length ; i++){
            totalSum+=histogram[i]*i;
        }

        var backgroundSum=0, weightB=0, weightF=0;
        var maxVar=0;
        var threshold=0;

        for(var t=0 ; t<histogram.length ; t++){
            weightB+= histogram[t];
            if(weightB==0) continue;

            weightF = totalNum - weightB;
            if(weightF==0) break;

            backgroundSum += t*histogram[t];

            var meanB = backgroundSum / weightB;
            var meanF = (totalSum - backgroundSum) / weightF;

            var varBetween = weightB*weightF*Math.pow((meanB-meanF), 2);

            if(varBetween>maxVar){
                maxVar = varBetween;
                threshold = t;
            }
        }
        return threshold;
    };

    window.OtsuJS = OtsuJS;

}).call(this);