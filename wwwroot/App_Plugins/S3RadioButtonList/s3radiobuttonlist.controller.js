angular.module("umbraco").controller("S3RadioButtonListController", function ($scope) {
    $scope.uniqueId = String.CreateGuid();

    $scope.horizontalStyle = ($scope.model.config.layoutDirection === 'horizontal') ? "{'display':'inline-block'}" : null;

    // newline separated -> array of "text;key"
    var textKeys = $scope.model.config.textKeys.split('\n');
    var textKeyList = _.map(textKeys, function (tk) {
        // "text;key" -> {text:tk[0], key:tk[1]}
        var textkey = tk.split(';');
        return { text: textkey[0], key: textkey[1] };
    });
    $scope.textKeyList = textKeyList;
});