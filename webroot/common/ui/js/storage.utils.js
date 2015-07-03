/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view-model',
    'monitor/infrastructure/ui/js/views/StoragenodeGridView',
    'monitor/infrastructure/ui/js/views/StoragenodeListView',
    'monitor/infrastructure/ui/js/views/StorageNodeView',
    'monitor/infrastructure/ui/js/views/StorageNodeTabView',
    'monitor/storage/ui/js/views/DiskListView',
    'monitor/storage/ui/js/views/DiskGridView',
    'monitor/storage/ui/js/views/DiskView',
    'monitor/storage/ui/js/views/DiskTabView',
    'monitor/storage/ui/js/views/DiskDetailsView',
    'monitor/storage/ui/js/views/DiskActivityStatsView',
], function (_, ContrailViewModel, StoragenodeGridView, StoragenodeListView, StorageNodeView, StorageNodeTabView,
             DiskListView, DiskGridView, DiskView, DiskTabView, DiskDetailsView, DiskActivityStatsView
            ) {
    var SUtils = function () {
        var self = this;

        self.getDownNodeCnt = function (data) {
            var downNodes = $.grep(data, function (obj, idx) {
                return obj['color'] == d3Colors['red'];
            });
            return downNodes.length;
        };

        self.clearTimers = function () {
            $.each(storageConsoleTimer, function (idx, value) {
                logMessage("clearing timer:", value);
                clearTimeout(value)
            });
            storageConsoleTimer = [];
        };

        self.getHealthSevLevelLbl = function (obj) {
            if (obj == 'HEALTH_OK' || obj == 'OK' || obj == 'up')
                return 'INFO';
            else if (obj == 'HEALTH_WARN' || obj == 'warn')
                return 'WARNING';
            else if (obj == 'HEALTH_ERR' || obj == 'HEALTH_CRIT' || obj == 'down')
                return 'ERROR';
            else
                return 'NOTICE';
        };

        self.byteToGB = function (bytes) {
            return (bytes / 1073741824).toFixed(2);
        };

        self.calcPercent = function (val1, val2) {
            return ((val1 / val2) * 100).toFixed(2);
        };

        self.getStorageNodeColor = function (d, obj) {
            obj = ifNull(obj, {});
            if (obj['status'] == "down")
                return d3Colors['red'];
            if (obj['status'] == "warn")
                return d3Colors['orange'];
            return d3Colors['blue'];
        };

        self.getStorageNodeStatusTmpl = function (obj) {
            var statusTmpl = contrail.getTemplate4Id('storage-status-template');
            if (obj == "up")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['INFO'],
                        sevLevels: sevLevels
                    }) + " up</span>";
            else if (obj == "warn")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['WARNING'],
                        sevLevels: sevLevels
                    }) + " warn</span>";
            else if (obj == "down")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['ERROR'],
                        sevLevels: sevLevels
                    }) + " down</span>";
            else
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['NOTICE'],
                        sevLevels: sevLevels
                    }) + " N/A</span>";
        };

        self.processStorageNodeAlerts = function (obj) {
            var alertsList = [];
            var infoObj = {
                name: obj['name'],
                type: 'Storage Node',
                ip: obj['ip']
            };

            $.each(obj['osds'], function (idx, osd) {
                if (osd['status'] == 'down') {
                    alertsList.push($.extend({}, {
                        ip: osd['public_addr'],
                        sevLevel: sevLevels['ERROR'],
                        msg: swm.DISK_DOWN_LIST.format(osd['name']),
                        timeStamp: new Date(osd['osd_xinfo']['down_stamp']).getTime() * 1000
                    }, infoObj));
                }
                if (osd['cluster_status'] == 'out') {
                    if (!obj['isDiskOut']) {
                        obj['disk_out_list'] = []
                        obj['isDiskOut'] = true
                    }
                    obj['disk_out_list'].push(' ' + osd['name'])
                }
            });

            if (obj['isDiskOut'] == true)
                alertsList.push($.extend({}, {
                    sevLevel: sevLevels['WARNING'],
                    msg: swm.DISK_OUT.format(obj['disk_out_list'].length, obj['disk_out_list'])
                }, infoObj));

            if (obj['errorStrings'] != null && obj['errorStrings'].length > 0) {
                $.each(obj['errorStrings'], function (idx, errorString) {
                    alertsList.push($.extend({}, {
                        sevLevel: sevLevels['WARNING'],
                        msg: errorString
                    }, infoObj));
                });
            }
            return alertsList.sort(dashboardUtils.sortInfraAlerts);
        };

        self.processStorageHealthAlerts = function (obj) {
            var alertsList = [];
            var _this = self;
            var timeStamp = new Date(obj['last_updated_time']).getTime() * 1000;
            var defInfoObj = {
                name: 'Storage Cluster',
                type: 'Storage',
                ip: '',
                timeStamp: timeStamp
            };

            $.each(obj['health']['details'], function (idx, msg) {
                var msgArr = msg.split(" ");
                if (msgArr.slice(0, 1)[0].indexOf("mon") > -1) {
                    alertsList.push({
                        name: msgArr[0].split(".")[1],
                        type: 'Storage Monitor',
                        ip: msgArr[2],
                        sevLevel: sevLevels['WARNING'],
                        msg: msgArr.slice(3).join(" "),
                        timeStamp: timeStamp
                    });
                } else {
                    alertsList.push($.extend({}, {
                        sevLevel: sevLevels['INFO'],
                        msg: msg
                    }, defInfoObj));
                }
            });

            $.each(obj['health']['summary'], function (idx, msg) {
                alertsList.push($.extend({}, {
                    sevLevel: sevLevels[_this.getHealthSevLevelLbl(msg['severity'])],
                    msg: msg['summary']
                }, defInfoObj));
            });

            return alertsList.sort(dashboardUtils.sortInfraAlerts);
        };

        self.byteToGB = function (bytes) {
            var gb = (bytes / 1073741824).toFixed(2);
            return gb;
        }

        self.kiloByteToGB = function (kbytes) {
            var gb = (kbytes / 1048576).toFixed(2);
            return gb;
        }

        self.renderView = function (viewName, parentElement, model, viewAttributes, modelMap) {
            var elementView;

            switch (viewName) {
                case "StoragenodeListView" :
                    elementView = new StoragenodeListView({
                        el: parentElement,
                        model: model,
                        attributes: viewAttributes
                    });
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "StoragenodeGridView" :
                    elementView = new StoragenodeGridView({
                        el: parentElement,
                        model: model,
                        attributes: viewAttributes
                    });
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "StorageNodeView" :
                    elementView = new StorageNodeView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "StorageNodeTabView" :
                    elementView = new StorageNodeTabView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;


                case "DiskListView" :
                    elementView = new DiskListView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DiskGridView" :
                    elementView = new DiskGridView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DiskView" :
                    elementView = new DiskView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DiskTabView" :
                    elementView = new DiskTabView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DiskDetailsView" :
                    elementView = new DiskDetailsView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DiskActivityStatsView" :
                    elementView = new DiskActivityStatsView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;
            }
        }
    };

    return SUtils;
});
