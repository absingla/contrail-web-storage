/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var DiskActivityStatsView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = this.attributes.viewConfig,
                diskName = viewConfig['disk'],
                storageNodeName = viewConfig['storageNode'];

            var diskRemoteConfig = {
                url: swc.get(swc.URL_DISK_ACTIVITY_STATS, diskName, storageNodeName),
                type: 'GET'
            };

            var ucid = storageNodeName != null ? (swc.UCID_PREFIX_MS_LISTS + storageNodeName + ":disks_stats") : swc.UCID_ALL_DISK_STATS;

            cowu.renderView4Config(self.$el, self.model, getDiskActivityViewConfig(diskRemoteConfig, ucid));

        }
    });

    var getDiskActivityViewConfig = function (diskRemoteConfig, ucid) {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_LIST_VIEW_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: "",
                                title: "",
                                view: "",
                                viewConfig: {
                                    elementConfig: ""
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };

    return DiskActivityStatsView;
});
