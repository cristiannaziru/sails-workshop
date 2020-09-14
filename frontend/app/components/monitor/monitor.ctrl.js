(function () {
    angular
        .module('workshop')
        .controller('MonitorCtrl', MonitorCtrl);

    MonitorCtrl.$inject = ['$scope']
    function MonitorCtrl($scope) {
        io.socket.on('statistics', function (response) {
            response = JSON.parse(response);
            $scope.status = response.UPGRADE;
            $scope.$apply();
        })
        $scope.get_status = io.socket.get("/upgrade/current-status");
    }
}());
