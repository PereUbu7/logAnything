let NewLogPostViewModel = function() {
    let self = this;

    self.chosenDate = ko.observable(new Date());
    self.gotDate = ko.observable(self.chosenDate());
    
    self.bilar = ko.observableArray([]);
    self.valdBil = ko.observable();

    self.km = ko.observable();
    self.liter = ko.observable();
    self.kronor = ko.observable();

    self.resetInputs = function () {
        self.km(null);
        self.liter(null);
        self.kronor(null);
    }

    self.loadData = function () {
        $.getJSON(window.urlApi + "?keys=true", function (allData) {
            let mappedKeys = $.map(allData, function (item) { return item; });
            self.bilar(mappedKeys);
        });
    }

    self.save = function() {
        if(!this.validateInput()) { return; }

        v = {
            "liter": self.liter(),
            "km": self.km(),
            "kronor": self.kronor(),
            "date": self.chosenDate()
        };

        $.getJSON(window.urlApi + "?log=true&key=" + self.valdBil() + "&value=" + ko.toJSON(v), function () {
            self.loadData();
            self.resetInputs();
        });
    }; 

    self.validateInput = () => {
        if(isNaN(parseInt(self.liter()))) { alert("Liter är inte ett nummer"); return false; }
        if(isNaN(parseInt(self.km()))) { alert("Km är inte ett nummer"); return false; }
        if(isNaN(parseInt(self.kronor()))) { alert("Kronor är inte ett nummer"); return false; }
        return true;
    }

    self.loadData();
};

ko.applyBindings(new NewLogPostViewModel());