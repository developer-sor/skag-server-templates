var temp = ['temp', 1, 2, 3, 2, -3, 3, -2, 1, 1, 1, 0, 1, 1, 2, 3, 2, -3, 3, -2, 1, 1, 1, 0, 1];
var sensor1 = ['sensor1', 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250];
var sensor2 = ['sensor2', 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50];

var actualMax = Math.max.apply(null, temp.slice(1));
var actualMin = Math.min.apply(null, temp.slice(1));

var dataMax = 0;
var dataTwoThirds = 0;
var dataOneThird = 0;

var data = [sensor1, sensor2, temp];

var paddingLeft = 115;


function findDataAverageValues() {
    //TODO: Erstatte sensors med data fra server
    var maxValue = 0;
    var amountOfSensors = data.length - 1; //Minus temp sensor?
    for (var i = 0; i < data[0].length; i++) {

        var amountToCheckAgainstMax = 0;
        for (var y = 0; y < amountOfSensors; y++) {
            amountToCheckAgainstMax += data[y][i];
        }
        maxValue = amountToCheckAgainstMax > maxValue ? amountToCheckAgainstMax : maxValue;
    }
    dataMax = maxValue;
    dataTwoThirds = maxValue * 0.66;;
    dataOneThird = maxValue * 0.33;;
    console.log("max ", dataMax, " dataTwoThirds ", dataTwoThirds, " dataOneThird ", dataOneThird);
}

findDataAverageValues();

var chart = c3.generate({
    padding: {
        top: 10,
        left: paddingLeft,
        bottom: -2
    },
    data: {
        columns: data,
        type: 'bar',
        types: {
            temp: 'spline'
        },
        groups: [
            ['sensor1', 'sensor2']
        ],
        axes: {
            temp: 'y2'
        }
    },
    legend: {
        show: false
    },
    axis: {
        y: {
            padding: {
                top: 100
            },
            tick: {
                format: function (x) { return " " + x + "kW -"; },
                count: 3,
                values: [dataOneThird, dataTwoThirds, dataMax]
            }
        },
        y2: {
            show: true,
            max: actualMax + (actualMax - actualMin) * 0.5,
            min: actualMin - (actualMax - actualMin) * 0.5,
            tick: {
                format: function (x) { return x + "C°"; },
                count: 3,
                values: [actualMin, actualMax]
            }
        },
        x: {
            show: true,
            tick: {
                format: function (x) { if (x == 0 || x == 24) { return "" }; }
            }
        },
        x2: {
            show: true
        }
    },
    bar: {
        width: {
            ratio: 0.99
        }
    },
    point: {
        show: false
    }
});


function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}

function adjustXTicks() {
    $(".c3-axis-x line").each(function () {
        $(this).attr('y2', 12);
    });
}


//Markerer bar som har høyeste verdi
function markHighestBar() {
    var highestHeight = window.innerHeight;
    var index = null;
    $(".c3-bar").each(function () {
        var d = $(this).attr('d').split(',');
        var height = parseFloat(d[d.length - 1]);
        if (highestHeight > height) {
            highestHeight = height;
            index = $(this).attr("class").split('c3-bar-')[1];
            console.log(index);
        }
    });
    $('.c3-bar-' + index).addClass("markedBar");
}

//Gjøre line graf litt lenger på slutten
function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var data = path.attr('d').split(',');
    data[data.length - 2] = (parseFloat(data[data.length - 2]) + 20).toString();
    path.attr('d', data);
}

expandWhiteBand();
markHighestBar();
makePathGoAllTheWayAndGetLastXY();
adjustXTicks();