function LogPost(id, data) {
    let self = this;
    self.id = id;
    self.tidsstämpel = data.date;
    self.km = data.km;
    self.liter = data.liter;
    self.kronor = data.kronor;
}

let ViewLogPostViewModel = function() {
    let self = this;

    self.chosenStartDate = ko.observable();
    self.chosenEndDate = ko.observable();
    
    self.bilar = ko.observableArray([]);
    self.valdBil = ko.observable();

    self.logs = ko.observableArray([]);

    self.filteredLogs = ko.computed(function () {
        let start = self.chosenStartDate();
        let end = self.chosenEndDate();

        return ko.utils.arrayFilter(self.logs(), function(row) {
            return (!start || row.tidsstämpel > start) && 
                   (!end   || row.tidsstämpel < end);
        });
    });

    self.totalKm = ko.computed(function() {
        if(self.logs().length == 0) { return 0; }

        let values = self.filteredLogs().map(o => parseInt(o.km)).filter(o => !isNaN(o));

        return Math.max(...values) - Math.min(...values);
    });

    self.totalKmText = ko.computed(function() {
        if(self.logs().length == 0) { return ""; }
        return "Antal km: " + self.totalKm();
    });

    self.summaLiter = ko.computed(function() {
        if(self.logs().length == 0) { return 0; }

        return self.filteredLogs().map(o => parseInt(o.liter)).reduce(
            (previousValue, currentValue) => {
                if(!isNaN(currentValue)) {
                    return previousValue + currentValue;
                }
                else { return 0; }
            },
            0
          );
    });

    self.summaLiterText = ko.computed(function() {
        if(self.logs().length == 0) { return ""; }
        return "Antal liter: " + self.summaLiter();
    });

    self.summaKronor = ko.computed(function() {
        if(self.logs().length == 0) { return 0; }

        return self.filteredLogs().map(o => parseInt(o.kronor)).reduce(
            (previousValue, currentValue) => {
                if(!isNaN(currentValue)) {
                    return previousValue + currentValue;
                }
                else { return 0; }
            },
            0
          );
    });

    self.summaKronorText = ko.computed(function() {
        if(self.logs().length == 0) { return ""; }
        return "Antal kronor: " + self.summaKronor();
    });

    self.literPerKmText = ko.computed(function() {
        if(self.totalKm() != 0)
            return 10*self.summaLiter()/self.totalKm() + " liter/mil";
    });

    self.kronorPerKmText = ko.computed(function() {
        if(self.totalKm() != 0)
            return 10*self.summaKronor()/self.totalKm() + "kr/mil";
    })

    self.loadData = function () {
        $.getJSON(window.urlApi + "?keys=true", function (allData) {
            let mappedKeys = $.map(allData, function (item) { return item; });
            self.bilar(mappedKeys);
        });
    }

    self.loadLogs = () => {
        $.getJSON(window.urlApi + "?key=" + self.valdBil(), function (allData) {
            let mappedLogs = $.map(allData, function (item) { 
                try
                {
                return new LogPost(item.id, JSON.parse(item.value)); 
                }
                catch(ex) { 
                    console.error(ex);
                    return new LogPost(item.id, {tidstämpel: "", liter:0, kronor:0, km:0}); 
                }
            });
            
            self.logs(mappedLogs);
        });
    }

    self.removeLogPost = (item) => { 
        self.logs.destroy(item);

        $.getJSON(window.urlApi + "?delete=" + item.id, function () {
        });
        self.loadLogs();
    }

    self.loadData();
};

ko.applyBindings(new ViewLogPostViewModel());