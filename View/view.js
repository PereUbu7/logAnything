function LogPost(id, data) {
    let self = this;
    self.id = id;
    self.tidsstämpel = data.date.substring(0, 10);
    self.km = data.km;
    self.liter = data.liter;
    self.kronor = data.kronor;

    self.dMil = null;
    self.dKrdMil = null;
    self.dldMil = null;
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
        if(self.totalKm() != 0) {
            var lastLiter = self.logs()[self.logs().length - 1].liter;
            return (10*(self.summaLiter() - lastLiter)/self.totalKm()).toFixed(2) + " liter/mil";
        }
    });

    self.kronorPerKmText = ko.computed(function() {
        if(self.totalKm() != 0) { 
            var lastKronor = self.logs()[self.logs().length - 1].kronor;
            return (10*(self.summaKronor() - lastKronor)/self.totalKm()).toFixed(2) + " kr/mil";
        }
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

            mappedLogs.sort((a, b) => {
                return a.tidsstämpel > b.tidsstämpel;
            })

            self.logs(self.calculateListAggregations(mappedLogs));
        });
    }

    self.calculateListAggregations = (logList) => {
        if(logList.length < 2) {
            return logList;
        }

        for(var index = 1; index < logList.length; ++index) {
            var dMil = (logList[index].km - logList[index - 1].km) / 10;
            
            if(dMil == 0) { continue; }

            var dKr = logList[index - 1].kronor;
            var dliter = logList[index - 1].liter;

            logList[index].dMil = dMil
            logList[index].dKrdMil = (dKr / dMil).toFixed(2);
            logList[index].dldMil = (dliter / dMil).toFixed(2);
        }

        return logList;
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