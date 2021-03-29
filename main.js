var hashPair = function(a,b){
    return a+","+b;//inefficient I know
}


var generatePrimePairs = function(n,m){
    var pairs = [[1,1]];
    for(var i = 1; i <= n; i++){
        for(var j = i; j <= m; j++){
            if(commonFactorEqual(i,j) === 1){
                var pair = [i,j];
                pairs.push(pair);
            }
        }
    }
    return pairs;
};

var commonFactorEqual = function(a,b){
    if(a === b)return 1;
    var cnt = 0;
    while(true){
        cnt++;
        if(cnt > 1000)throw new Error("common factor either got invalid input, or the input was too large");
        var temp;
        if(a > b){//swap
            temp = a;
            a = b;
            b = temp;
        }
        if(b%a === 0){
            return a;
        }
        var b = b-a;
    }
};

var generateEveryPermutations = function(arr){
    var result = [];
    for(var i = 0; i < arr.length; i++){
        var a = arr[i][0];
        var b = arr[i][1];
        result.push([a,b]);
        result.push([a,-b]);
        result.push([-a,b]);
        result.push([-a,-b]);
    }
    var result1 = [];
    for(var i = 0; i < result.length; i++){//add every possible multiples
        var pair = result[i];
        for(var j = 1; j <= 10; j++){
            result1.push({
                pair,
                multiple:j
            });
        }
    }
    return result1;
};

var addWeight = function(arr){
    for(var i = 0; i < arr.length; i++){
        var problem = arr[i];
        var weight = 1;
        if(problem.multiple !== 1){
            weight /= 25;
        }
        if(problem.pair[0] < 0){
            weight /= 2;
        }
        if(problem.pair[1] < 0){
            weight /= 2;
        }
        weight /= (Math.abs(problem.pair[1]))**2;
        problem.weight = weight;
    }
    return arr;
}

var addMultiples = function(arr){
    var result = [];
    for(var i = 0; i < arr.length; i++){
        var a = arr[i][0];
        var b = arr[i][1];
        result.push([a,b]);
        result.push([a,-b]);
        result.push([-a,b]);
        result.push([-a,-b]);
    }
    return result;
};

var randomize = function(arr){
    return arr.sort(a=>Math.random()-0.5);
};

var joinArray = function(a1,a2){
    for(var i = 0; i < a2.length; i++){
        a1.push(a2[i]);
    }
    return a1;
};

var chooseWeightedRandom = function(arr,n){
    var cfd = [];
    var cfdTop = 0;
    for(var i = 0; i < arr.length; i++){
        cfdTop += arr[i].weight;
        cfd[i] = cfdTop;
    }
    var selected = [];
    var selectedHash = {};
    for(var i = 0; i < n; i++){
        var cfval = Math.random()*cfdTop;
        var cfprev = 0;
        var isSelected = false;
        for(var j = 0; j < cfd.length; j++){//linear, but gonna do in binary
            var cfthis = cfd[j];//cf right now
            if(cfprev < cfval && cfval <= cfthis){
                if(j in selectedHash){
                    //value was already selected, skipping
                }else{
                    selected.push(arr[j]);
                    isSelected = true;
                    selectedHash[j] = true;
                }
                break;
            }
        }
        if(!isSelected){//value was not selected, resizing everything
            var newarr = [];
            for(var j = 0; j < arr.length; j++){
                if(!(j in selectedHash)){
                    newarr.push(arr[j]);
                }else{
                    n--;
                }
            }
            return joinArray(selected,chooseWeightedRandom(newarr,n));
        }
    }
    return selected;
};

var formatVarConstant = function(a){
    if(a === "1"){
        return ""
    }else if(a === "−1"){
        return "−"
    }else{
        return a;
    }
};

var formatInt = function(a){
    if(a >= 0){
        return "+"+a;
    }else{
        return "−"+(-a)+"";
    }
}

var formatProblems = function(arr){
    console.log(arr);
    for(var i = 0; i < arr.length; i++){
        console.log(arr[i]);
        var p = arr[i];
        var a = formatVarConstant(p.multiple+"");
        var b = formatVarConstant(formatInt(p.multiple*(p.pair[0]+p.pair[1])));
        var c = formatInt(p.multiple*p.pair[0]*p.pair[1]);
        if(b === "+0"){
            p.question = a+"x²"+c;
        }else{
            p.question = a+"x²"+b+"x"+c;
        }
        if(p.pair[0] === p.pair[1]){
            p.answer = "x = "+(-p.pair[0]);//invert the content of factors
        }else{
            p.answer = "x = "+(-p.pair[0])+", "+(-p.pair[1]);
        }
    }
    return arr;
}

var generateProblems = function(n){
    var pairs = addWeight(generateEveryPermutations(generatePrimePairs(3,20)));
    console.log(pairs);
    if(!pairs[n-1])n = pairs.length;
    var problems = formatProblems(chooseWeightedRandom(pairs,n));
    console.log(problems);
    var questions = "";
    var answers = "";
    for(var i = 0; i < problems.length; i++){
        questions += "Q"+(i+1)+": "+problems[i].question+" = 0\n\n\n\n\n\n\n";
        answers += "A"+(i+1)+": "+problems[i].answer+"\n";
    }
    console.log(questions);
    console.log(answers);
};