/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SGridConfig = function () {
        this.storagenodesColumns = [
            {
                field: "name",
                name: "Host name",
                formatter: function (r, c, v, cd, dc) {
                    return cellTemplateLinks({
                        cellText: 'name',
                        name: 'name',
                        statusBubble: false,
                        rowData: dc
                    });
                },
                events: {
                    onClick: onClickGrid
                },
                cssClass: 'cell-hyperlink-blue',
                minWidth: 150
            }, {
                field: "status",
                name: "Status",
                formatter: function (r, c, v, cd, dc) {
                    return swu.getStorageNodeStatusTmpl(dc['status'])
                },
                minWidth: 50
            }, {
                field: "",
                name: "Disks",
                minWidth: 20,
                formatter: function (r, c, v, cd, dc) {
                    return dc['osds'].length;
                }
            }, {
                field: "osds_total",
                name: "Total",
                minWidth: 60
            }, {
                field: "osds_used",
                name: "Used",
                minWidth: 60
            }, {
                field: "osds_available",
                name: "Available",
                minWidth: 60
            }
        ];

        this.disksColumns = [
            {
                field: "id",
                name: "Disk ID",
                width: 50
            },
            {
                field: "name",
                name: "Disk Name",
                events: {
                    onClick: function (e, dc) {
                        onDisksRowSelChange(dc);
                    }
                },
                cssClass: 'cell-hyperlink-blue',
                minWidth: 60
            },
            {
                field: "host",
                name: "Hostname",
                minWidth: 60
            },
            {
                field: "total",
                name: "Total",
                minWidth: 50
            },
            {
                field: "used",
                name: "Used",
                minWidth: 50
            },
            {
                field: "available",
                name: "Available",
                minWidth: 50
            },
            {
                field: "status",
                name: "Status",
                formatter: function (r, c, v, cd, dc) {
                    return dc['status_tmpl'];
                },
                minWidth: 50
            },
            {
                field: "cluster_status",
                name: "Membership",
                formatter: function (r, c, v, cd, dc) {
                    return dc['cluster_status_tmpl'];
                },
                cssClass: 'grid-status-label',
                minWidth: 50
            }
        ];

        this.storageMonitorsColumns = [
            {
                field: "name",
                name: "Hostname",
                minWidth: 60
            },
            {
                field:"act-health",
                name:"Activity Status",
                formatter: function(r,c,v,cd,dc){
                    return swu.getMonitorNodeHealthStatusTmpl(dc['act_health'])
                },
                width:100
            },
            {
                field:"health",
                name:"Overall Status",
                formatter: function(r,c,v,cd,dc){
                    return swu.getMonitorNodeHealthStatusTmpl(dc['health'])
                },
                width:100
            },
            {
                field:"addr",
                name:"IP Address",
                width:150
            }
        ];
    };

    function onClickGrid(e, selRowDataItem) {
        var name = $(e.target).attr('name'),
            fqName;
        if ($.inArray(name, ['storagenode']) > -1) {
            fqName = selRowDataItem['name'];
            swgrc.setStoragenodeURLHashParams(null, fqName, true);
        }

    };

    function onDisksRowSelChange(currObj) {
        layoutHandler.setURLHashParams({
            node: currObj['host'],
            tab: 'details:' + currObj['name']
        }, {
            p: 'mon_storage_disks'
        });
    };

    return SGridConfig;
});
