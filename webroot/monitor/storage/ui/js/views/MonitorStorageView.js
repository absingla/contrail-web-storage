/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    '../../../../infrastructure/ui/js/views/StorageBreadcrumbView.js'
], function (_, Backbone, BreadcrumbView) {
    var MonitorStorageView = Backbone.View.extend({
        el: $(contentContainer),

        renderDisk: function (viewConfig) {
            var self = this,
                hashParams = viewConfig.hashParams,
                fqName = (contrail.checkIfKeyExistInObject(true, hashParams, 'focusedElement.fqName') ? hashParams.focusedElement.fqName : null),
                breadcrumbView = new BreadcrumbView();

            // TBD update breadcrumb

            cowu.renderView4Config(this.$el, null, getDiskViewConfig(hashParams));
        },

        renderDiskList: function () {
            cowu.renderView4Config(this.$el, null, getDiskListConfig());
        },

        renderMonitorList: function (viewConfig) {
            var self = this;
            cowu.renderView4Config(self.$el, null, getStorageMonitorListViewConfig());
        }

    });

    function getDiskViewConfig(hashParams) {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_VIEW_ID]),
            view: "DiskView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {
                disk: hashParams.focusedElement.fqName,
                storageNode: hashParams.focusedElement.fqHost
            }
        };
    }

    function getDiskListConfig() {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_LIST_PAGE_ID]),
            view: "DiskListView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {}
        }
    };

    function getStorageMonitorListViewConfig() {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGE_MONITOR_LIST_PAGE_ID]),
            view: "StorageMonListView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {}
        };
    }

    return MonitorStorageView;
});