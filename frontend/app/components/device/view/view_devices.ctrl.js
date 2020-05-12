(function () {
  angular.module("workshop").controller("ViewDevicesCtrl", ViewDevicesCtrl);

  ViewDevicesCtrl.$inject = ["$scope", "$http"];
  function ViewDevicesCtrl($scope, $http) {
    $scope.devices = [];

    $scope.busy = $http.get("/api/device").then((response) => {
      $scope.devices = response.data;
    });

    $scope.deleteDevice = function (id) {
      $http.delete(`/api/device/${id}`).then(() => {
        $scope.devices = $scope.devices.filter((device) => device.id !== id);
      });
    };
  }
})();
