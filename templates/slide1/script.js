$(function () {
    $("#slideTitle").html(parent.installationData.name);
    $("#textContainer").html(parent.installationData.description.replace(/(?:\r\n|\r|\n)/g, '<br />'));
});