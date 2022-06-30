window.urlApi = "http://" + window.location.hostname + "/logAnything/api.php";

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {    
        ko.utils.registerEventHandler(element, 'change', function () {
            var value = valueAccessor();

            if (element.value !== null && element.value !== undefined && element.value.length > 0) {
                value(element.value);
            }
            else {
                value('');
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        var output = '';

        if ($(element).is('input') === true) {
            $(element).val(output);
        } else {
            $(element).text(output);
        }
    }
};