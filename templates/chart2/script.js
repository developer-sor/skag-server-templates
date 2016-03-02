var temp = ['temp', 1, 2, 3, 2, -3, 3, -2, 1, 1, 1, 0, 1, 1, 2, 3, 2, -3, 3, -2, 1, 1, 1, 0, 1];

var actualMax = Math.max.apply(null, temp.slice(1));
var actualMin = Math.min.apply(null, temp.slice(1));

var data = [
            ['data1', 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250],
            ['data2', 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50],
            temp
];

var paddingLeft = 115;

var chart = c3.generate({
    padding: {
        top: 10,
        left: paddingLeft
    },
    data: {
        columns: data,
        type: 'bar',
        types: {
            temp: 'spline'
        },
        groups: [
            ['data1', 'data2']
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
                top: 100,
                bottom: 10
            },
            tick: {
                format: function (x) { return " " + x + "kW -"; }
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
            show: false
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


var tempBox = {
    x: 0,
    y: 0
}





function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var data = path.attr('d').split(',');
    data[data.length - 2] = (parseFloat(data[data.length - 2]) + 20).toString();
    path.attr('d', data);

    //Getting last path position and setting them so we can use it to place temperature box
    tempBox.x = data[data.length - 2];
    tempBox.y = data[data.length - 1];
}

makePathGoAllTheWayAndGetLastXY();