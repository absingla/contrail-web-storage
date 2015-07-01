/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var DiskListView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this, viewConfig = this.attributes.viewConfig;

            var listModelConfig = {
                remote: {
                    ajaxConfig: {
                        url: swc.URL_DISKS_SUMMARY,
                        type: "GET"
                    },
                    dataParser: swp.disksDataParser
                },
                cacheConfig: {
                    ucid: swc.UCID_ALL_DISK_LIST
                }
            };

            var contrailListModel = new ContrailListModel(listModelConfig);
            cowu.renderView4Config(this.$el, contrailListModel, getDiskListViewConfig());
        }
    });

    var getDiskListViewConfig = function () {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_LIST_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: swl.DISK_SCATTER_CHART_ID,
                                title: swl.TITLE_DISKS,
                                view: "ZoomScatterChartView",
                                viewConfig: {
                                    loadChartInChunks: true,
                                    chartOptions: {
                                        xLabel: 'Usage (%)',
                                        yLabel: 'Avg. Bandwidth [R + W] (B)',
                                        forceX: [0, 10],
                                        forceY: [0, 1],
                                        dataParser: function (response) {
                                            return response;
                                        },
                                        tooltipConfigCB: getDiskTooltipConfig,
                                        clickCB: onScatterChartClick,
                                        sizeFieldName: '',
                                        noDataMessage: "No disk available."
                                    }
                                }
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                elementId: swl.MONITOR_DISKS_ID,
                                title: swl.TITLE_DISKS,
                                view: "DiskGridView",
                                app: cowc.APP_CONTRAIL_STORAGE,
                                viewConfig: {storageNode: null, parentType: 'storageNode', pagerOptions: { options: { pageSize: 10, pageSizeSelect: [10, 50, 100] } }}
                            }
                        ]
                    }
                ]
            }
        }
    };

    function onScatterChartClick(chartConfig) {
        // TODO
    };

    function getDiskTooltipConfig(data) {
        // TODO
    };

    return DiskListView;
});