/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SLabels = function () {
        this.MONITOR_STORAGENODE_LIST_PAGE_ID = "monitor-storagenode-list-page"
        this.MONITOR_STORAGENODE_LIST_ID = "monitor-storagenode-list";
        this.MONITOR_STORAGENODE_LIST_VIEW_ID = "monitor-storagenode-list-view";
        this.MONITOR_STORAGENODE_VIEW_ID = "monitor-storagenode-view";
        this.MONITOR_STORAGENODES_ID = "monitor-storagenodes";

        this.MONITOR_DISKS_ID = "monitor-disks";
        this.MONITOR_DISK_LIST_PAGE_ID = "monitor-disk-list-page";
        this.MONITOR_DISK_LIST_VIEW_ID = "monitor-disk-list-view";
        this.MONITOR_DISK_VIEW_ID = "monitor-disk-view";
        this.MONITOR_DISK_LIST_ID = "monitor-disk-list";
        this.MONITOR_DISK_GRID_ID = "monitor-disk-grid";

        this.MONITOR_STORAGE_MONITORS_ID = "monitor-storagemons";
        this.MONITOR_STORAGE_MONITOR_LIST_PAGE_ID = "monitor-storagemon-list-page";
        this.MONITOR_STORAGE_MONITOR_LIST_VIEW_ID = "monitor-storagemon-list-view";
        this.MONITOR_STORAGE_MONITOR_LIST_ID = "monitor-storagemon-list";
        this.MONITOR_STORAGE_MONITOR_GRID_ID = "monitor-storagemon-grid";

        this.TITLE_STORAGENODES = "Storage Nodes";
        this.TITLE_STORAGENODES_SUMMARY = "Storage Nodes Summary";
        this.TITLE_STORAGENODE = "Storage Node";
        this.TITLE_STORAGENODE_DETAILS = "Storage Node Details";

        this.TITLE_DISKS = "Disks";
        this.TITLE_DISK_SUMMARY = "Disk Summary";
        this.TITLE_DISK_DETAILS = "Disk Details";
        this.TITLE_DISK_USAGE = "Disk Usage";
        this.TITLE_DISK_ACTIVITY_STATS = "Disk Activity";
        this.TITLE_DISK_ACTIVITY_THRPT_STATS = "Disk Throughput";
        this.TITLE_DISK_ACTIVITY_IOPS_STATS = "Disk IOPs";
        this.TITLE_DISK_ACTIVITY_LATENCY_STATS = "Disk Latency";

        this.TITLE_MONITORS = "Storage Monitors";
        this.TITLE_MONITOR_SUMMARY = "Storage Monitor Summary";
        this.TITLE_MONITOR_DETAILS = "Storage Monitor Details";
        this.TITLE_ROOT_DISK_USAGE = "Root Disk Usage";



        this.TITLE_CHART_ELEMENT_STORAGENODE = "storage node";
        this.TITLE_CHART_ELEMENT_DISK = "disk";

        this.STORAGENODE_TAB_VIEW_ID = "storagenode-tab-view"
        this.STORAGENODE_TAB_ID = "storagenode";
        this.STORAGENODES_SCATTER_CHART_ID  = "storagenodes-scatter-chart";
        this.STORAGENODES_GRID_ID = "storagenodes-grid";

        this.DISK_TAB_ID = "disk";
        this.DISK_TAB_VIEW_ID = "disk-tab-view";
        this.DISK_SCATTER_CHART_ID = "disk-scatter-chart";
        this.DISK_DETAILS_ID = "disk-details";
        this.DISK_ACTIVITY_STATS_ID = "disk-activity-stats";
        this.DISK_ACTIVITY_VIEW_ID = "disk-activity-view";
        this.DISK_ACTIVITY_THRPT_CHART_ID =  "disk-activity-thrpt-chart";
        this.DISK_ACTIVITY_IOPS_CHART_ID =  "disk-activity-iops-chart";
        this.DISK_ACTIVITY_LATENCY_CHART_ID =  "disk-activity-latency-chart";

        this.DISK_ACTIVITY_THRPT_CHART_YAXIS_LABEL = "Throughput";
        this.DISK_ACTIVITY_IOPS_CHART_YAXIS_LABEL = "IOPs";
        this.DISK_ACTIVITY_LATENCY_CHART_YAXIS_LABEL = "Latency";

        var labelMap = {
            /* Storage Node Details */
            name: 'Name',
            osds_total: 'Total',
            osds_used: 'Used',
            osds_count: 'Count',
            osds_status: 'Status/Membership',
            status_tmpl: 'Status',
            cluster_status_tmpl: 'Membership',
            public_addr: 'Public Address',
            uuid: 'UUID',
            /* Disk Details */
            apply_latency: 'Apply Latency',
            commit_latency: 'Commit Latency',
            /* Storage Monitor Details */
            avail_percent: 'Available',
            addr: 'IP Address',
            skew: 'Clock Skew'
        };

        this.get = function (key) {
            var keyArray, newKey;
            if (_.has(labelMap, key)) {
                return labelMap[key];
            } else {
                keyArray = key.split('.');
                newKey = keyArray[keyArray.length - 1];
                if (keyArray.length > 1 && _.has(labelMap, newKey)) {
                    return labelMap[newKey];
                } else {
                    return newKey.charAt(0).toUpperCase() + newKey.slice(1);
                }
            }
        };
    };
    return SLabels;
});
