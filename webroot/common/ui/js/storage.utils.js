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
    'monitor/storage/ui/js/views/StorageMonListView',
    'monitor/storage/ui/js/views/StorageMonGridView',
    'monitor/storage/ui/js/views/PoolListView',
    'monitor/storage/ui/js/views/PoolGridView',
    'monitor/storage/ui/js/views/DashboardView',
    'monitor/storage/ui/js/views/ClusterActivityStatsView',
    'monitor/storage/ui/js/views/PoolStatsView',
    'monitor/storage/ui/js/views/ClusterUsageView',
], function (_, ContrailViewModel, StoragenodeGridView, StoragenodeListView, StorageNodeView, StorageNodeTabView,
             DiskListView, DiskGridView, DiskView, DiskTabView, DiskDetailsView, DiskActivityStatsView,
             StorageMonListView, StorageMonGridView, PoolListView, PoolGridView, DashboardView, ClusterActivityStatsView,
             PoolStatsView, ClusterUsageView
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

        self.formatIpPort = function (ip) {
            return ip.split(':')[0] + ', Port: ' + ip.split(':')[1];
        }

        self.getDiskColor = function (disk) {
            if (disk['status'] == 'up') {
                if (disk['cluster_status'] == 'in') {
                    return swc.DISK_OKAY_COLOR;
                } else if (disk['cluster_status'] == 'out') {
                    return swc.DISK_WARNING_COLOR;
                } else {
                    return swc.DISK_DEFAULT_COLOR;
                }
            } else if (disk['status'] == 'down') {
                return swc.DISK_ERROR_COLOR;
            }
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

        self.getMonitorNodeHealthStatusTmpl = function (obj) {
            var statusTmpl = contrail.getTemplate4Id('storage-status-template');
            if (obj == "HEALTH_OK")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['INFO'],
                        sevLevels: sevLevels
                    }) + " ok</span>";
            else if (obj == "HEALTH_WARN")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['WARNING'],
                        sevLevels: sevLevels
                    }) + " warn</span>";
            else if (obj == "HEALTH_CRIT")
                return "<span> " + statusTmpl({
                        sevLevel: sevLevels['ERROR'],
                        sevLevels: sevLevels
                    }) + " critical</span>";
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
        };

        self.kiloByteToGB = function (kbytes) {
            var gb = (kbytes / 1048576).toFixed(2);
            return gb;
        };

        self.getSelector4Id = function (id) {
            if (id != null) {
                return $('#' + id);
            }
        };

        self.addUnits2IOPs = function (data, noDecimal, maxPrecision, precision) {
            var dataPrefixes = ['IOPs', 'K IOPs', 'M IOPs', 'B IOPs', 'T IOPs'],
                formatStr = '', decimalDigits = 2, size = 1000;

            if (!$.isNumeric(data)) {
                return '-';
            } else if (data == 0) {
                return '0 IOPs';
            }

            if ((maxPrecision != null) && (maxPrecision == true)) {
                decimalDigits = 6;
            } else if (precision != null) {
                decimalDigits = precision < 7 ? precision : 6;
            }

            if (noDecimal != null && noDecimal == true)
                decimalDigits = 0;


            data = parseInt(data);
            data = makePositive(data);

            $.each(dataPrefixes, function (idx, prefix) {
                if (data < size) {
                    formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    return false;
                } else {
                    //last iteration
                    if (idx == (dataPrefixes.length - 1))
                        formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    else
                        data = data / size;
                }
            });
            return formatStr;
        };

        self.addUnits2Latency = function (data, noDecimal, maxPrecision, precision) {
            var dataPrefixes = ['ms', 's', 'm', 'hr'],
                formatStr = '', decimalDigits = 2, size = 60;

            if (!$.isNumeric(data)) {
                return '-';
            } else if (data == 0) {
                return '0 ms';
            }

            if ((maxPrecision != null) && (maxPrecision == true)) {
                decimalDigits = 6;
            } else if (precision != null) {
                decimalDigits = precision < 7 ? precision : 6;
            }

            if (noDecimal != null && noDecimal == true)
                decimalDigits = 0;


            data = parseInt(data);
            data = makePositive(data);

            $.each(dataPrefixes, function (idx, prefix) {
                if (data < size) {
                    formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    return false;
                } else {
                    //last iteration
                    if (idx == (dataPrefixes.length - 1))
                        formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    else
                        data = data / size;
                }
            });
            return formatStr;
        };

        self.addUnits2Number = function(data, noDecimal, maxPrecision, precision, label) {
            var dataPrefixes = ['', 'K', 'M', 'B', 'T'],
                formatStr = '', decimalDigits = 2, size = 1000;

            if (label != null) {
                dataPrefixes = $.map(dataPrefixes, function(unit) {
                    if (unit != '') {
                        return unit + " " + label;
                    } else {
                        return label;
                    }
                });
            }

            if (!$.isNumeric(data)) {
                return '-';
            } else if (data == 0) {
                if (label != null) {
                    return '0 ' + label;
                }
                return '0 ';
            }

            if ((maxPrecision != null) && (maxPrecision == true)) {
                decimalDigits = 6;
            } else if(precision != null) {
                decimalDigits = precision < 7 ? precision : 6;
            }

            if (noDecimal != null && noDecimal == true)
                decimalDigits = 0;


            data = parseInt(data);
            data = makePositive(data);

            $.each(dataPrefixes, function (idx, prefix) {
                if (data < size) {
                    formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    return false;
                } else {
                    //last iteration
                    if (idx == (dataPrefixes.length - 1))
                        formatStr = contrail.format('{0} {1}', parseFloat(data.toFixed(decimalDigits)), prefix);
                    else
                        data = data / size;
                }
            });
            return formatStr;
        };

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

                case "StorageMonListView" :
                    elementView = new StorageMonListView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "StorageMonGridView" :
                    elementView = new StorageMonGridView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "PoolListView" :
                    elementView = new PoolListView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "PoolGridView" :
                    elementView = new PoolGridView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "PoolStatsView" :
                    elementView = new PoolStatsView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "DashboardView" :
                    elementView = new DashboardView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "ClusterActivityStatsView" :
                    elementView = new ClusterActivityStatsView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;

                case "ClusterUsageView" :
                    elementView = new ClusterUsageView({el: parentElement, model: model, attributes: viewAttributes});
                    elementView.modelMap = modelMap;
                    elementView.render();
                    break;
            }
        }
    };

    return SUtils;
});
