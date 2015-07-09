/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var StoragenodeListView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this, viewConfig = this.attributes.viewConfig;

            var listModelConfig = {
                remote: {
                    ajaxConfig: {
                        url: swc.get(swc.URL_STORAGENODES_SUMMARY),
                        type: "GET"
                    },
                    dataParser: swp.storagenodeDataParser
                },
                cacheConfig: {
                    ucid: swc.UCID_ALL_STORAGENODE_LIST
                }
            };

            var contrailListModel = new ContrailListModel(listModelConfig);
            cowu.renderView4Config(this.$el, contrailListModel, getStoragenodeListViewConfig());
        }
    });

    var getStoragenodeListViewConfig = function () {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGENODE_LIST_ID]),
            view: "SectionView",
            viewConfig: {
                rows: [
                    {
                        columns: [
                            {
                                elementId: swl.STORAGENODES_SCATTER_CHART_ID,
                                title: swl.TITLE_STORAGENODES,
                                view: "ZoomScatterChartView",
                                viewConfig: {
                                    loadChartInChunks: true,
                                    chartOptions: {
                                        xLabel: 'Used (%)',
                                        xLabelFormat: d3.format(".01f"),
                                        forceX: [0, 1],
                                        yLabel: 'Avg 30Min BW (Read+Write)',
                                        yLabelFormat: function(yValue) {
                                            var formattedValue = formatThroughput(yValue, true);
                                            return formattedValue;
                                        },
                                        dataParser: function (response) {
                                            var nodeData = $.map(response, function(val, idx) {
                                                if (val['name'] != 'CLUSTER_HEALTH')
                                                    return val;
                                            });
                                            return nodeData;
                                        },
                                        tooltipConfigCB: getStoragenodeTooltipConfig,
                                        clickCB: onScatterChartClick,
                                        sizeFieldName: 'osds_used_perc',
                                        margin: {left: 70},
                                        noDataMessage: "Unable to get any storage node details."
                                     }
                                }
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                elementId: swl.MONITOR_STORAGENODES_ID,
                                title: swl.TITLE_STORAGENODES,
                                view: "StoragenodeGridView",
                                app: cowc.APP_CONTRAIL_STORAGE,
                                viewConfig: {pagerOptions: { options: { pageSize: 10, pageSizeSelect: [10, 50, 100] } }}
                            }
                        ]
                    }
                ]
            }
        }
    };

    var onScatterChartClick = function(chartConfig) {
        var storagenodeFQN = chartConfig['name'];
        swcc.setStoragenodeURLHashParams(null, storagenodeFQN, true);
    };

    var getStoragenodeTooltipConfig = function(data) {
        var storagenodeFQNObj = data.name.split(':');

        return {
            title: {
                name: storagenodeFQNObj[0],
                type: swl.TITLE_CHART_ELEMENT_STORAGENODE
            },
            content: {
                iconClass: 'icon-contrail-storage-node',
                info: [
                    {label: 'Name', value: data['name']},
                    {label:'Disks', value: data['osds'].length},
                    {label:'Total', value: data['osds_total']},
                    {label:'Available', value: data['osds_available']},
                    {label:'Avg 30Min BW (Read+Write)', value:formatThroughput(data['y'])}
                ],
                actions: [
                    {
                        type: 'link',
                        text: 'View',
                        iconClass: 'icon-external-link',
                        callback: onScatterChartClick
                    }
                ]
            },
            dimension: {
                width: 350
            }
        };
    };

    return StoragenodeListView;
});