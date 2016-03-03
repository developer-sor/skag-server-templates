

var data = [
          ['2014', 90, 80, 100],
          ['2015', 50, 70, 50],
];

var categories = ['November', 'Desemember', 'Januar'];

var chart = c3.generate({
    bindto: '#chart',
    size: {
        height: 480
    },
    data: {
        columns: data,
        type: 'bar',
        labels: {
            format: function (v, id, i, j) { return id; }
        },
    },
    axis: {
        y: {
            show: false
        },
        x: {
            show: false
        }
    },
    legend: {
        show: false
    },
    bar: {
        width: {
            ratio: 0.7,
        }
    }
});

function setCategories() {
    var categoriesHTML = '';
    for (var i = 0; i < categories.length; i++) {
        categoriesHTML += '<span class="category"><h3>' + categories[i] + '</h3></span>';
    }
    $("#months").html(categoriesHTML);
}

function setSavedAmout(amount) {
    if (amount > 0) {
        $("#amountSaved").text(amount);
        $("#saved").show();
    }
    else {
        $("#saved").hide();
    }
}

setCategories();
setSavedAmout(54320);