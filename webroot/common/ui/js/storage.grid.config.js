/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SGridConfig = function () {
        this.storagenodesColumns = [{
                field: "name",
                name: "Host name",
                formatter: function(r, c, v, cd, dc) {
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
                formatter: function(r, c, v, cd, dc) {
                    return swu.getStorageNodeStatusTmpl(dc['status'])
                },
                minWidth: 50
            }, {
                field: "",
                name: "Disks",
                minWidth: 20,
                formatter: function(r, c, v, cd, dc) {
                    return dc['osds'].length;
                }
            }, {
                field: "osds_total",
                name: "Disks Space",
                minWidth: 60,
            }, {
                field: "osds_used",
                name: "Disks Used Space",
                minWidth: 60,
            }, {
                field: "osds_available_perc",
                name: "Disks Available %",
                minWidth: 60,
            }];
    };

    function onClickGrid(e, selRowDataItem) {
        var name = $(e.target).attr('name'),
            fqName;
        if ($.inArray(name, ['storagenode']) > -1) {
            fqName = selRowDataItem['name'];
            swgrc.setStoragenodeURLHashParams(null, fqName, true);
        }

    };

    return SGridConfig;
});
