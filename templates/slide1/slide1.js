

function viewModel() {
    var self = this;

    this.clock = ko.observable(new Date().getHours() + ":" + new Date().getMinutes());

    this.tick = function () {
        self.clock(new Date().getHours() + ":" + new Date().getMinutes());
    };

    setInterval(self.tick, 3000);
};

ko.applyBindings(new viewModel());