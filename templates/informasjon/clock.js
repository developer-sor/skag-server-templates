

function viewModel() {
    var self = this;

    function getTwoDigitDate() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)
    }


    this.clock = ko.observable();
    this.clock(getTwoDigitDate());

    this.tick = function () {
        self.clock(getTwoDigitDate());
    };

    setInterval(self.tick, 5000);
}



ko.applyBindings(new viewModel());