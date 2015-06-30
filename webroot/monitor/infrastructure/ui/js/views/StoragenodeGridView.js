/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var StoragenodeGridView = Backbone.View.extend({
        el: $(contentContainer),

        render: function() {
            var self = this,
                viewConfig = self.attributes.viewConfig,
                pagerOptions = viewConfig['pagerOptions'],
                ucid = swc.UCID_ALL_STORAGENODE_LIST;

            var storagenodesRemoteConfig = {
                url: swc.get(swc.URL_STORAGENODES_SUMMARY),
                type: "GET"
            };

            cowu.renderView4Config(self.$el, self.model, getStoragenodeGridViewConfig(storagenodesRemoteConfig, ucid, pagerOptions));

        }
    });

    var getStoragenodeGridViewConfig = function(storagenodesRemoteConfig, ucid, pagerOptions) {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGENODE_LIST_VIEW_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: swl.STORAGENODES_GRID_ID,
                                title: swl.TITLE_STORAGENODES_SUMMARY,
                                view: "GridView",
                                viewConfig: {
                                    elementConfig: getStoragenodeGridConfig(storagenodesRemoteConfig, ucid, pagerOptions)
                                }
                            }
                        ]
                    }
                ]
            }
        }

    };

    var getStoragenodeGridConfig = function(storagenodesRemoteConfig, ucid, pagerOptions) {
        var gridElementConfig = {
            header: {
                title: {
                    text: swl.TITLE_STORAGENODES_SUMMARY,
                    cssClass: 'blue'
                },
                defaultControls: {
                    collapseable: false,
                    exportable: true,
                    refreshable: true,
                    searchable: true
                },
                customControls: []
            },
            body: {
                options: {
                    rowHeight: 30,
                    autoHeight: true,
                    enableAsyncPostRender: true,
                    forceFitColumns: true
                },
                dataSource: {
                    remote: {
                        ajaxConfig: storagenodesRemoteConfig,
                        dataParser: swp.storagenodeDataParser
                    },
                    cacheConfig: ucid
                },
                statusMessages: {
                    loading: {
                        text: 'Loading Storage Nodes..'
                    },
                    empty: {
                        text: 'No Storage Nodes to display'
                    },
                    errorGettingData: {
                        type: 'error',
                        iconClasses: 'icon-warning',
                        text: 'Error in getting Data.'
                    }
                }
            },
            footer: {
                pager:  contrail.handleIfNull(pagerOptions, { options: { pageSize: 5, pageSizeSelect: [5, 10, 50, 100] } })
            },
            columnHeader: swgc.storagenodesColumns
        };
        return gridElementConfig;
    }

    return StoragenodeGridView;
});
