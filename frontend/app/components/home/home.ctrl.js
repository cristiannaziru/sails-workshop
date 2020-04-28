(function() {
    angular
      .module('workshop')
      .controller('HomeCtrl', HomeCtrl)
  
    function HomeCtrl($rootScope, $scope, $http) {
      $scope.message = "Hellow Werld"

      function getUsers(){
        $http.get('/users').then(function(res){
          console.log('res', res)
        })
      }

      $scope.getUsers = getUsers
    }
  
    HomeCtrl.$inject = ['$rootScope', '$scope', '$routeParams']
  })();
  