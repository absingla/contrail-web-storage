/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var StorageNodeGridView = Backbone.View.extend({
        el: $(contentContainer),

        render: function() {
            var self = this,
                viewConfig = self.attributes.viewConfig,
                pagerOptions = viewConfig['pagerOptions'],
                ucid = swc.UCID_ALL_STORAGENODE_LIST;

            var storageNodesRemoteConfig = {
                url: swc.get(swc.URL_STORAGENODES_SUMMARY),
                type: "GET"
            };

            cowu.renderView4Config(self.$el, self.model, getStorageNodeGridViewConfig(storageNodesRemoteConfig, ucid, pagerOptions));

        }
    });

    var getStorageNodeGridViewConfig = function(storagenodesRemoteConfig, ucid, pagerOptions) {
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
                                    elementConfig: getStorageNodeGridConfig(storagenodesRemoteConfig, ucid, pagerOptions)
                                }
                            }
                        ]
                    }
                ]
            }
        }

    };

    var getStorageNodeGridConfig = function(storageNodesRemoteConfig, ucid, pagerOptions) {
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
                }
            },
            body: {
                options: {
                    rowHeight: 30,
                    autoHeight: true,
                    enableAsyncPostRender: true,
                    forceFitColumns: true,
                    checkboxSelectable: false,
                    detail: {
                        template: cowu.generateDetailTemplateHTML(getStorageNodeDetailsTemplateConfig(), cowc.APP_CONTRAIL_STORAGE, '{{{formatGridJSON2HTML this.rawData}}}')
                    }
                },
                dataSource: {
                    remote: {
                        ajaxConfig: storageNodesRemoteConfig,
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
            columnHeader: {
                columns: swgc.storagenodesColumns
            },
            footer: {
                pager:  contrail.handleIfNull(pagerOptions, { options: { pageSize: 5, pageSizeSelect: [5, 10, 50, 100] } })
            }
        };
        return gridElementConfig;
    };

    function getStorageNodeDetailsTemplateConfig() {
        //TODO: Complete
        return {
            templateGenerator: 'RowSectionTemplateGenerator',
            templateGeneratorConfig: {
                rows: [
                    {
                        templateGenerator: 'ColumnSectionTemplateGenerator',
                        templateGeneratorConfig: {
                            columns: [
                                {
                                    class: 'span6',
                                    rows: [
                                        {
                                            title: swl.TITLE_STORAGENODE_DETAILS,
                                            templateGenerator: 'BlockListTemplateGenerator',
                                            templateGeneratorConfig: [
                                                {
                                                    key: 'name',
                                                    templateGenerator: 'TextGenerator'
                                                },
                                                {
                                                    key: 'status',
                                                    templateGenerator: 'TextGenerator'
                                                },
                                                {
                                                    key: 'version',
                                                    templateGenerator: 'TextGenerator'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    class: 'span6',
                                    rows: [
                                        {
                                            title: swl.TITLE_DISK_DETAILS,
                                            templateGenerator: 'BlockListTemplateGenerator',
                                            templateGeneratorConfig: [
                                                {
                                                    key: 'osds_count',
                                                    templateGenerator: 'TextGenerator'
                                                },
                                                {
                                                    key: 'osds_status',
                                                    templateGenerator: 'TextGenerator'
                                                },
                                                {
                                                    key: 'osds_used',
                                                    templateGenerator: 'TextGenerator'
                                                },
                                                {
                                                    key: 'osds_total',
                                                    templateGenerator: 'TextGenerator'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        };
    };

    return StorageNodeGridView;
});
