/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'contrail-list-model'
], function (_, ContrailView, ContrailListModel) {
    var DashboardView = ContrailView.extend({
        el: $(contentContainer),

        render: function () {
            var self = this;
            self.renderView4Config(self.$el, null, getDashboardViewConfig());
        }
    });

    function getDashboardViewConfig() {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGE_DASHBOARD_LIST_ID]),
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
                                    modelConfig: {
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
                                    },
                                    loadChartInChunks: true,
                                    chartOptions: {
                                        xLabel: 'Usage (%)',
                                        xLabelFormat: d3.format(".01f"),
                                        forceX: [0, 1],
                                        yLabel: 'Avg. Bandwidth [R + W] ',
                                        yLabelFormat: function (yValue) {
                                            return formatThroughput(yValue, true);
                                        },
                                        dataParser: function (response) {
                                            return response;
                                        },
                                        tooltipConfigCB: getDiskTooltipConfig,
                                        clickCB: onScatterChartClick,
                                        sizeFieldName: 'used_perc',
                                        margin: {left: 70},
                                        noDataMessage: "Unable to get disk data."
                                    }
                                }
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                elementId: cowu.formatElementId([swl.MONITOR_STORAGE_DASHBOARD_USAGE_SECTION_ID]),
                                view: "SectionView",
                                viewConfig: {
                                    rows: [
                                        {
                                            columns: [
                                                {
                                                    elementId: swl.MONITOR_CLUSTER_USAGE_ID,
                                                    title: swl.TITLE_CLUSTER_USAGE,
                                                    view: "ClusterUsageView",
                                                    app: cowc.APP_CONTRAIL_STORAGE,
                                                    viewConfig: {
                                                        class: 'span3',
                                                        modelConfig: {
                                                            remote: {
                                                                ajaxConfig: {
                                                                    url: swc.URL_CLUSTER_USAGE,
                                                                    type: 'GET'
                                                                },
                                                                dataParser: swp.clusterUsageDataParser
                                                            },
                                                            cacheConfig: {
                                                                ucid: swc.UCID_CLUSTER_USAGE
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    elementId: swl.POOL_STATS_CHART_ID,
                                                    view: "DonutChartView",
                                                    app: cowc.APP_CONTRAIL_STORAGE,
                                                    viewConfig: {
                                                        title: swl.TITLE_POOL_STATS,
                                                        class: 'span3',
                                                        modelConfig: {
                                                            remote: {
                                                                ajaxConfig: {
                                                                    url: swc.URL_POOLS_SUMMARY,
                                                                    type: 'GET'
                                                                },
                                                                dataParser: swp.poolsDataParser
                                                            },
                                                            cacheConfig: {
                                                                ucid: swc.UCID_ALL_POOL_LIST
                                                            }
                                                        },
                                                        loadChartInChunks: true,
                                                        parseFn: swp.poolsDonutChartDataParser,
                                                        chartOptions: {
                                                            //margin: {top: 10, right: 10, bottom: 20, left: 40},
                                                            donutRatio: 0.6,
                                                            height: 250,
                                                            showLegend: true,
                                                            showLabels: false,
                                                            legendRightAlign: true,
                                                            legendPadding: 32,
                                                            noDataMessage: "Unable to get pool data.",
                                                            valueFormat: formatBytes

                                                        }
                                                    }
                                                },
                                                {
                                                    elementId: swl.MONITOR_STORAGE_DASHBOARD_CLUSTER_STATS_ID,
                                                    title: swl.TITLE_DISK_ACTIVITY_STATS,
                                                    view: "ClusterActivityStatsView",
                                                    app: cowc.APP_CONTRAIL_STORAGE,
                                                    viewConfig: {
                                                        class: 'span6',
                                                        modelConfig: {
                                                            modelKey: swc.UMID_CLUSTER_DISK_UVE,
                                                            remote: {
                                                                ajaxConfig: {
                                                                    url: swc.URL_CLUSTER_DISK_ACTIVITY_STATS,
                                                                    type: 'GET'
                                                                },
                                                                dataParser: swp.diskActivityStatsParser
                                                            },
                                                            cacheConfig: {
                                                                ucid: swc.UCID_CLUSTER_DISK_STATS
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };

    function onScatterChartClick(chartConfig) {
        var diskFQN = chartConfig['name'],
            storagenodeFQN = chartConfig['host'];
        swcc.setDiskURLHashParams(null, {fqName: diskFQN, fqHost: storagenodeFQN}, true);
    };

    function getDiskTooltipConfig(data) {
        return swu.getDiskTooltipConfig({data: data, actions: {linkCallbackFn: onScatterChartClick}});
    };

    return DashboardView;
});