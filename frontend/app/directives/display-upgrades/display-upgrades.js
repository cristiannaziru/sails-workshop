(function () {
    'use strict';

    angular
        .module('workshop')
        .directive('displayUpgrades', displayUpgradesDirective);

    /** @ngInject */
    function displayUpgradesDirective(DTOptionsBuilder, DTColumnBuilder, UpgradeService, $compile) {
        function displayUpgrades($scope) {
            var vm = this;

            const haPairs = [];
            vm.get_tmp_merged = f1();

            function f1() {
                UpgradeService.get_tmp_merged().then(response => {
                    build_ha_pairs(response.data);
                });
            }
            function build_ha_pairs(ha_pairs) {
                for (let key in ha_pairs) {
                    let ha_pair = build_ha_pair(key, ha_pairs);
                    haPairs.push(ha_pair);
                    io.socket.post("/upgrade/status", { id: ha_pair.pid, name: ha_pair.name });
                    io.socket.post("/upgrade/status", { id: ha_pair.pid, name: ha_pair.primary.name });
                    io.socket.post("/upgrade/status", { id: ha_pair.pid, name: ha_pair.secondary.name });
                    io.socket.post("/upgrade/last-log-message", { id: ha_pair.pid, name: 'debug_upgrade' });
                    io.socket.post("/upgrade/last-log-message", { id: ha_pair.pid, name: ha_pair.primary.name });
                    io.socket.post("/upgrade/last-log-message", { id: ha_pair.pid, name: ha_pair.secondary.name });
                }
            }

            function build_ha_pair(key, ha_pairs) {
                let ha_pair = {
                    ha: key,
                    primary: ha_pairs[key].primary,
                    secondary: ha_pairs[key].secondary,
                    name: ha_pairs[key].name,
                    type: ha_pairs[key].type,
                    pid: ha_pairs[key].id,
                    status: "",
                    lastLogMessage: "",
                    info: {
                        id: ha_pairs[key].id,
                        name: ha_pairs[key].name,
                        primaryName: ha_pairs[key].primary.name,
                        secondaryName: ha_pairs[key].secondary.name
                    }
                }
                return ha_pair;
            }

            vm.log = {};
            io.socket.on('log', function (response) {
                vm.log.data = response;
                $scope.$apply();
            });

            io.socket.on('status', function (response) {
                for (let haPair of haPairs) {
                    if (haPair.pid === response.id) {
                        let status = response.data.slice(2);
                        if (haPair.name === response.name) {
                            haPair.status = status;
                        }
                        else if (haPair.primary.name === response.name) {
                            haPair.primary.status = status;
                        }
                        else if (haPair.secondary.name === response.name) {
                            haPair.secondary.status = status;
                        }
                        break;
                    }
                }
                $scope.$apply();
            });

            io.socket.on('lastLogMessage', function (response) {
                for (let haPair of haPairs) {
                    if (haPair.pid === response.id) {
                        let message = response.data;
                        if (response.name === 'debug_upgrade') {
                            haPair.lastLogMessage = message !== undefined ? message : "";
                        }
                        else if (haPair.primary.name === response.name) {
                            haPair.primary.lastLogMessage = message;
                        }
                        else if (haPair.secondary.name === response.name) {
                            haPair.secondary.lastLogMessage = message;
                        }
                        break;
                    }
                }
                $scope.$apply();
            });

            vm.open_dialog = function (id, name) {
                const dialog = angular.element("#modalDialog");
                const nav = angular.element("#mainNav");
                const monitor = angular.element("#monitor");
                const statistics = angular.element("#statistics");
                if (dialog) {
                    dialog.fadeIn();
                    monitor.addClass('blur');
                    nav.addClass('blur');
                    statistics.addClass('blur');
                    vm.log = {
                        id: id,
                        name: name
                    };
                    io.socket.post("/upgrade/log", { id: id, name: name, stop: false });
                }
            };

            vm.close_dialog = function (id, name) {
                const dialog = angular.element("#modalDialog");
                const nav = angular.element("#mainNav");
                const monitor = angular.element("#monitor");
                const statistics = angular.element("#statistics");
                if (dialog) {
                    dialog.fadeOut();
                    monitor.removeClass('blur');
                    nav.removeClass('blur');
                    statistics.removeClass('blur');
                    io.socket.post("/upgrade/log", { id: id, name: name, stop: true });
                }
            };

            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('data', haPairs)
                .withOption('createdRow', function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function (header) {
                    if (!vm.headerCompiled) {
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers')
                .withOption('responsive', true);
            vm.dtColumns = [
                DTColumnBuilder.newColumn('name').withTitle('HA Pair'),
                DTColumnBuilder.newColumn('status').withTitle('Status'),
                DTColumnBuilder.newColumn('lastLogMessage').withTitle('Last Log Message'), ,
                DTColumnBuilder.newColumn('info').withTitle('View Full Log').renderWith(function (data) {
                    return `           
                    <button class="btn btn-success" ng-click="showCase.open_dialog('${data.id}', 'debug_upgrade')">View Full Log</button>
                    <button class="btn btn-success" ng-click="showCase.open_dialog('${data.id}', '${data.primaryName}')">View Primary Log</button>
                    <button class="btn btn-success" ng-click="showCase.open_dialog('${data.id}', '${data.secondaryName}')">View Secondary Log</button>
                    `
                }),
                DTColumnBuilder.newColumn('primary').renderWith(function (primary) {
                    return `                 
                    <table class="table table-bordered monitor-table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">IP</th>
                                <th scope="col">Port</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Log Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                ${primary.name}
                                </td>
                                <td>
                                ${primary.ip}
                                </td>
                                <td>
                                ${primary.port}
                                </td>
                                <td>
                                ${primary.status}
                                </td>
                                <td>
                                ${primary.lastLogMessage}
                                </td>
                            </tr>
                    `
                }).withClass('none'),
                DTColumnBuilder.newColumn('secondary').renderWith(function (secondary) {
                    return `
                            <tr>
                                <td>
                                ${secondary.name}
                                </td>
                                <td>
                                ${secondary.ip}
                                </td>
                                <td>
                                ${secondary.port}
                                </td>
                                <td>
                                ${secondary.status}
                                </td>
                                <td>
                                ${secondary.lastLogMessage}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    `
                }).withClass('none')
            ];
        }

        return {
            bindToController: true,
            controller: displayUpgrades,
            controllerAs: 'showCase',
            restrict: 'E',
            templateUrl: '/directives/display-upgrades/display-upgrades.html',
        }
    }
}());