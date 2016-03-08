
console.log("Loading plugin ", "yr");
var template = {
    name: "yr",
    canShow: function () { return true;}
};

console.log('attaching module to parent');
parent.templateController.template = template;