/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SLabels = function () {
        this.MONITOR_STORAGE_ID = "monitor-storage";
        this.MONITOR_STORAGE_VIEW_ID = "monitor-storage-view";
        this.MONITOR_STORAGENODE_LIST_PAGE_ID = "monitor-storagenode-list-page"
        this.MONITOR_STORAGENODE_LIST_ID = "monitor-storagenode-list";
        this.MONITOR_STORAGENODE_LIST_VIEW_ID = "monitor-storagenode-list-view";
        this.MONITOR_STORAGENODES_ID = "monitor-storagenodes";

        this.MONITOR_DISKS_ID = "monitor-disks";
        this.MONITOR_DISK_LIST_PAGE_ID = "monitor-disk-list-page"
        this.MONITOR_DISK_LIST_VIEW_ID = "monitor-disk-list-view";
        this.MONITOR_DISK_LIST_ID = "monitor-disk-list";
        this.MONITOR_DISK_GRID_ID = "monitor-disk-grid";

        this.TITLE_STORAGENODES = "Storage Nodes";
        this.TITLE_STORAGENODES_SUMMARY = "Storage Nodes Summary";
        this.TITLE_STORAGENODE_DETAILS = "Storage Node Details";

        this.TITLE_DISKS = "Disks";
        this.TITLE_DISKS_SUMMARY = "Disks Summary";

        this.TITLE_GRAPH_ELEMENT_STORAGENODE = "storage node";

        this.STORAGENODES_SCATTER_CHART_ID  = "storagenodes-scatter-chart";
        this.STORAGENODES_GRID_ID = "storagenodes-grid";

    };
    return SLabels;
});
