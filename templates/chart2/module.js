﻿/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log("Loading plugin ", "chart2");

var template = {
    name: "chart2",
    canShow: function () {
        return true;
    }
};

parent.templateController.template = template;