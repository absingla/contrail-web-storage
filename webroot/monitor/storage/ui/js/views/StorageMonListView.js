/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var StorageMonListView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig,
                storageNodeName = viewConfig['storageNode'];

            var listModelConfig = {
                remote: {
                    ajaxConfig: {
                        url: storageNodeName != null ? swc.get(swc.URL_STORAGENODE_MONITOR_DETAILS, storageNodeName) : swc.URL_STORAGENODE_MONITORS_SUMMARY,
                        type: "GET"
                    },
                    dataParser: swp.storageMonitorsDataParser
                },
                cacheConfig: {
                    ucid: storageNodeName != null ? (swc.UCID_PREFIX_MS_LISTS + storageNodeName + ":monitor") : swc.UCID_ALL_MONITOR_LIST
                }
            };

            var contrailListModel = new ContrailListModel(listModelConfig);
            cowu.renderView4Config(self.$el, contrailListModel, getStorageMonListViewConfig());
        }
    });

    var getStorageMonListViewConfig = function () {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGE_MONITOR_LIST_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: swl.MONITOR_STORAGE_MONITORS_ID,
                                title: swl.TITLE_MONITORS,
                                view: "StorageMonGridView",
                                app: cowc.APP_CONTRAIL_STORAGE,
                                viewConfig: {
                                    storageNode: null,
                                    parentType: 'storageNode',
                                    pagerOptions: {options: {pageSize: 10, pageSizeSelect: [10, 50, 100]}}
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };

    return StorageMonListView;
});