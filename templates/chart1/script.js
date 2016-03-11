

//TODO: Only use when working with single slide
//var installationData = "";
//installationData = JSON.parse(window.localStorage.getItem(constants.installationData));
//$('#backgroundImage').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });
//window.localStorage.removeItem(constants.refChartTime);
//window.localStorage.removeItem(constants.refChartData);

$(function () {
    if (hasRecentChartData() && hasValidChartData()) {
        isFetchingData = false;
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        fetchData();
    }

    $("#chartContainer").addClass(parent.installationData.theme + 'Container');
    $("#main").addClass(parent.installationData.theme + 'Theme');
});


var referenceLabel = parent.installationData.referenceLabel || 'Referanse';
var compareLabelDefault = new Date().getFullYear();
var categories = [];
var years = [];
var data = [];
var savedAmount = 0;

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.months.data;

    var referenceData = [referenceLabel];
    var compareData = [compareLabelDefault];

    for (var i = 0; i < rawData.length; i++) {
        categories.push(rawData[i].description);
        var currentDate = new Date();
        years.push(currentDate.getMonth() + 1 > rawData[i].ind || rawData[i].ind - 4 > currentDate.getMonth() ? currentDate.getFullYear() - 1 : currentDate.getFullYear());

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