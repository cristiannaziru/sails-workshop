(function () {
    'use strict';

    angular
        .module('workshop')
        .directive('displayHaPairs', displayHaPairsDirective);

    /** @ngInject */
    function displayHaPairsDirective(DTOptionsBuilder, DTColumnBuilder) {
        function displayHaPairs() {
            var vm = this;
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: '/api/hapair',
                    type: 'GET'
                })
                .withPaginationType('full_numbers')
                .withOption('responsive', true);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('ha').withTitle('HA'),
                DTColumnBuilder.newColumn('name').withTitle('Name'),
                DTColumnBuilder.newColumn('type').withTitle('Type'),
                DTColumnBuilder.newColumn('pid').withTitle('ID'),
                DTColumnBuilder.newColumn('primary.ip').withTitle('Primary -- IP').withClass('none'),
                DTColumnBuilder.newColumn('primary.name').withTitle('Name').withClass('none'),
                DTColumnBuilder.newColumn('primary.uuid').withTitle('UUID').withClass('none'),
                DTColumnBuilder.newColumn('secondary.ip').withTitle('Secondary --  IP').withClass('none'),
                DTColumnBuilder.newColumn('secondary.name').withTitle('Name').withClass('none'),
                DTColumnBuilder.newColumn('secondary.uuid').withTitle('UUID').withClass('none')
            ];
        }

        return {
            bindToController: true,
            controller: displayHaPairs,
            controllerAs: 'showCase',
            restrict: 'E',
            templateUrl: '/directives/display-ha-pairs/display-ha-pairs.html',
        }
    }
}());