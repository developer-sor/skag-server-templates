﻿
//Only for dev
//var installationData = "";
//installationData = JSON.parse(window.localStorage.getItem(constants.installationData));
//$('body').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });


$(function () {
    $("#slideTitle").html(parent.installationData.name);
    $("#textContainer").html(parent.installationData.description.replace(/(?:\r\n|\r|\n)/g, '<br />'));
});