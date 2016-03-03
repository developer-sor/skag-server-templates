
//TODO: remove installationData references. Only useable when working with single slide
var installationData = "";

$(function () {
    installationData = JSON.parse(window.localStorage.getItem(constants.installationData));
    $('body').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });

    if (hasRecentChartData() && hasValidChartData()) {
        setChartWithLocalstoreData(prosessRawData);
    }
    else {
        fetchData();
    }
});


var referenceLabel = installationData.referenceLabel || 'Referanse';
var compareLabelDefault = new Date().getFullYear();
var categories = [];
var years = [];
var data = [];
var savedAmount = 0;

function fetchData() {
    var url = constants.api + constants.dataview.replace('{id}', installationData.id);
    $.ajax({
        method: "GET",
        contentType: "application/json",
        url: url,
        dataType: 'json'
    })
    .done(function (data) {
        var rawData = data.subs.months.data;
        if (!isNullOrEmpty(rawData)) {
            setChartLocalStoreData(rawData);
            prosessRawData(rawData);
        }
    });
}

function prosessRawData(rawData) {
    console.log(rawData);
    var referenceData = [referenceLabel];
    var compareData = [compareLabelDefault];
    
    for (var i = 0; i < rawData.length; i++) {
        categories.push(rawData[i].description);
        years.push(new Date().getMonth() + 1 > rawData[i].ind ? new Date().getFullYear() - 1 : new Date().getFullYear());

        referenceData.push(rawData[i].ref);
        compareData.push(rawData[i].val);

        savedAmount += (rawData[i].ref - rawData[i].val);
    }
    data.push(referenceData, compareData);
    populateChart();
}


function populateChart() {

    var chart = c3.generate({
        bindto: '#chart',
        size: {
            height: 480
        },
        data: {
            columns: data,
            type: 'bar',
            labels: {
                format: function (v, id, i, j) {
                    //console.log('v ', v, ' id', id, ' i ', i, ' j ', j);
                    if (id !== referenceLabel) {
                        return years[i];
                    }
                    else { return id; }
                }
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

    setCategories();
    setSavedAmount();
    expandWhiteBand();
}

function setCategories() {
    var categoriesHTML = '';
    for (var i = 0; i < categories.length; i++) {
        categoriesHTML += '<span class="category" style="width:' + (100 / categories.length) + '%"><h3>' + categories[i] + '</h3></span>';
    }
    $("#months").html(categoriesHTML);
}

function getSavedAmount() {

}

function setSavedAmount() {
    savedAmount = Math.floor(savedAmount);
    if (savedAmount > 0) {
        $("#amountSaved").text(savedAmount);
        $("#saved").show();
    }
    else {
        $("#saved").hide();
    }
}

function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}