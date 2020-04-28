(function() {
    angular
      .module('workshop')
      .controller('HomeCtrl', HomeCtrl)
  
    HomeCtrl.$inject = ['$scope', '$http']
    function HomeCtrl($scope, $http) {
      $scope.message = "Hellow Werld"
      $scope.users = [];

      function getUsers(){
        $http.get('/api/user').then(function(res){
          $scope.users = res.data
        })
      }

      $scope.getUsers = getUsers
    }
  
  })();
