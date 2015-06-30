/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    var MonitorStorageView = Backbone.View.extend({
        el: $(contentContainer),

        renderDiskList: function () {
            cowu.renderView4Config(this.$el, null, getDiskListConfig());
        }

    });

    function getDiskListConfig() {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_LIST_PAGE_ID]),
            view: "DiskListView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {}
        }
    };

    return MonitorStorageView;
});