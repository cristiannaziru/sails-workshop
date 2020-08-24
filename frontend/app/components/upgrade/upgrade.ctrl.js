(function () {
    angular
        .module('workshop')
        .controller('UpgradeCtrl', UpgradeCtrl);

    UpgradeCtrl.$inject = ['$scope', '$http', 'HAPairService']
    function UpgradeCtrl($scope, $http, HAPairService) {
        $scope.get_ha_pairs =
            HAPairService.get_ha_pairs().then(result => {
                $scope.ha_pairs = result.data;
            });

        $scope.logs = [];
        io.socket.on('upgrade', function (response) {
            if (response.verb === 'upgrade') {
                console.log(response.id + ":" + response.lastLogMessage);
                $scope.logs.push(response.lastLogMessage);
                $scope.$apply();
            }
        });

        let haPairsIDs = [];
        $scope.select = function (id, selected) {
            const haPairId = document.getElementById(id).value;
            if (selected) {
                haPairsIDs.push(haPairId);
            }
            else {
                const index = haPairsIDs.indexOf(haPairId);
                haPairsIDs.splice(index, 1);
            }
        }

        $scope.upgrade = function () {
            for (let index = 0; index < haPairsIDs.length; index++) {
                io.socket.get(`/upgrade/${haPairsIDs[index]}`);
            }
        }
    }
}());
