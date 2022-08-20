function LogPost(id, data) {
    let self = this;
    
    self.id = id;
    self.tidsstämpel = data.date.substring(0, 10);
    self.antalSäckar = data.antalSäckar;

    self.dagar = null;
    self.säckarPerDag = null;
    self.säckarPerVecka = null;
}

let NewLogPostViewModel = function() {
    let self = this;

    // Log
    self.chosenDate = ko.observable(new Date());
    self.gotDate = ko.observable(self.chosenDate());

    self.antalSäckar = ko.observable();

    self.resetInputs = function () {
        self.antalSäckar(null);
    }

    self.save = function() {
        if(!this.validateInput()) { return; }

        v = {
            antalSäckar: self.antalSäckar(),
            date: self.chosenDate()
        };

        $.getJSON(window.urlApi + "?log=true&key=pellets&value=" + ko.toJSON(v), function () {
            self.loadLogs();
            self.resetInputs();
        });
    }; 

    self.validateInput = () => {
        if(isNaN(parseInt(self.antalSäckar()))) { alert("Antal säckar är inte ett nummer"); return false; }
        return true;
    }

    // View logs
    self.chosenStartDate = ko.observable();
    self.chosenEndDate = ko.observable();

    self.logs = ko.observableArray([]);

    self.filteredLogs = ko.computed(function () {
        let start = self.chosenStartDate();
        let end = self.chosenEndDate();
        
        let filteredLogs = ko.utils.arrayFilter(self.logs(), function(row) {
            return (!start || row.tidsstämpel > start) && 
                   (!end   || row.tidsstämpel < end);
        });
        
        return filteredLogs;
    });

    self.totaltAntalSäckar = ko.computed(function() {
        if(self.logs().length == 0) { return 0; }

        return self.filteredLogs().map(o => parseInt(o.antalSäckar)).reduce(
            (previousValue, currentValue) => {
                if(!isNaN(currentValue)) {
                    return previousValue + currentValue;
                }
                else { return 0; }
            },
            0
          );
    });

    self.totaltAntalSäckarText = ko.computed(() => {
        return "Totalt antal säckar: " + self.totaltAntalSäckar();
    })

    self.totaltAntalDagar = ko.computed(function() {
        if(self.logs().length == 0) { return 0; }

        let logList = self.filteredLogs();
        let logLength = logList.length;
        let dagar = Math.ceil(((new Date(logList[logLength-1].tidsstämpel)).getTime() - (new Date(logList[0].tidsstämpel)).getTime()) / (1000 * 3600 * 24));
        return dagar;
    });

    self.totaltAntalDagarText = ko.computed(() => {
        return "Totalt antal dagar: " + self.totaltAntalDagar();
    })

    self.säckarPerVecka = ko.computed(() => {
        return (7 * (self.totaltAntalSäckar()) / self.totaltAntalDagar()).toPrecision(2);
    });

    self.säckarPerVeckaText = ko.computed(() => {
        return "Säckar per vecka: " + self.säckarPerVecka();
    });

    self.loadLogs = () => {
        $.getJSON(window.urlApi + "?key=pellets").then(function (allData) {
            let mappedLogs = $.map(allData, function (item) { 
                try
                {
                    return new LogPost(item.id, JSON.parse(item.value)); 
                }
                catch(ex) { 
                    console.error(ex);
                    return new LogPost(item.id, {tidstämpel: "", antalSäckar: 0}); 
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

        for(let index = 1; index < logList.length; ++index) {
            let dagar = Math.ceil(((new Date(logList[index].tidsstämpel)).getTime() - (new Date(logList[index-1].tidsstämpel)).getTime()) / (1000 * 3600 * 24));
            let antal = logList[index].antalSäckar;

            logList[index].dagar = dagar;
            logList[index].säckarPerDag = (antal / dagar).toFixed(2);
            logList[index].säckarPerVecka = (7 * antal / dagar).toFixed(2);
        }

        return logList;
    }

    self.removeLogPost = (item) => { 
        self.logs.destroy(item);

        $.getJSON(window.urlApi + "?delete=" + item.id, function () {
        });
        self.loadLogs();
    }

    self.loadLogs();
};

ko.applyBindings(new NewLogPostViewModel());