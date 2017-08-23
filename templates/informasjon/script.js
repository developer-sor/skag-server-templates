
$(function () {
    var informasjonssideId = getParameterByName('informasjonId', $(document).src);
    /*console.log('*********** ', informasjonssideId);*/

    var self = this;

    //Informasjonssidene skal forsøke å oppdatere hver gang de laster, så fjerner denne koden....
    /*if (hasRecentData(constants.informasjonData, informasjonssideId) && !parent.forceFetch) {
        setInformationpage(getLocalstoreData(constants.informasjonData, informasjonssideId));
        return;
    }*/

    var url = constants.api + constants.informasjonsside.replace("{informationpageId}", informasjonssideId);

    $.ajax({
        method: "GET",
        contentType: "application/json",
        url: url,
        dataType: 'json'
    }).done(function (data) {
        if (data) {
            /*console.log("Fetching informasjonsslide with id " + informasjonssideId + " successful");*/
            if(data.backgroundImageURL && checkURL(data.backgroundImageURL)) {
                convertToDataURLviaCanvas(data.backgroundImageURL, function (base64Img) {
                    data.backgroundImage = base64Img;
                    setLocalStoreData(constants.informasjonData, data, informasjonssideId);
                    setInformationpage(data);
                });
            } else {
                data.backgroundImage = null;
                setLocalStoreData(constants.informasjonData, data, informasjonssideId);
                setInformationpage(data);
            }

        }
        else handleError(informasjonssideId);
    }).fail(function (error) {
        /*console.error("Fetching informasjonsslide with id " + informasjonssideId + " failed!");*/
        handleError(informasjonssideId);
    });
});

function handleError(informasjonssideId) {
    if (hasNonExpiredData(constants.informasjonData, informasjonssideId)) {
        /*console.log('Backup solution: getting informasjondata from localstorage since fetch failed');*/
        self.setInformationpage(getLocalstoreData(constants.informasjonData, informasjonssideId));
    }
    else {
        /*console.log('Backup solution failed for the Informasjon template! No data in localstorage and fetch failed, running next slide');*/
        parent.templateController.abortSlide(template.name, informasjonssideId);
    }
}

function setInformationpage(data) {
    if(data.backgroundImage) {
        $('#backgroundImageInfoslide').css({
            'background-image': "url(data:" + data.backgroundImage + ")",
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        });
    }
    $("#slideTitle").html(data.description);
    $("#textContainer").html(data.bodyText);

    $("#main").addClass(data.theme + 'Theme');
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}