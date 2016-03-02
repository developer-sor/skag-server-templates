

var chart = c3.generate({
    padding: {
        top: 10,
        left: 115
    },
    data: {
        columns: [
            ['data1', 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250, 30, 200, 200, 400, 150, 250],
            ['data2', 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50, 130, 100, 30, 200, 30, 50]
        ],
        type: 'bar',
        groups: [
            ['data1', 'data2']
        ]
    },
    grid: {
        y: {
            lines: [{ value: 0 }]
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
                format: function (x) { return " " + x + "kW"; }
            },
            label: {
                position: 'outer-middle'
            }
        },
        x: {
            show: false
        }
    },
    bar: {
        width: {
            ratio: 1
        }
    }
});
