


function viewModel() {
    var self = this;

    this.getTwoDigitDate = function() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)
    }

    this.clock = ko.observable(this.getTwoDigitDate());

    this.tick = function () {
        self.clock(self.getTwoDigitDate());
    };

    setInterval(self.tick, 3000);
};



ko.applyBindings(new viewModel());