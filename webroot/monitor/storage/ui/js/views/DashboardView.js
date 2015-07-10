/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var DashboardView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig;

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
            cowu.renderView4Config(self.$el, contrailListModel, getDashboardViewConfig());
        }
    });

    var getDashboardViewConfig = function () {

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
                                    loadChartInChunks: true,
                                    chartOptions: {
                                        xLabel: 'Usage (%)',
                                        xLabelFormat: d3.format(".01f"),
                                        forceX: [0, 1],
                                        yLabel: 'Avg. Bandwidth [R + W] ',
                                        yLabelFormat: function(yValue) {
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
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                //TODO //Cluster USage
                            },
                            {
                                //TODO //Cluster Pool
                            },
                            {
                                elementId: swl.DISK_ACTIVITY_STATS_ID,
                                title: swl.TITLE_DISK_ACTIVITY_STATS,
                                view: "ClusterActivityStatsView",
                                app: cowc.APP_CONTRAIL_STORAGE,
                                viewConfig: {
                                    class: 'span5',
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
    };

    function onScatterChartClick(chartConfig) {
        var diskFQN = chartConfig['name'],
            storagenodeFQN = chartConfig['host'];
        swcc.setDiskURLHashParams(null, {fqName: diskFQN, fqHost:storagenodeFQN}, true);
    };

    function getDiskTooltipConfig(data) {
        var diskFQNObj = data.name.split(':');

        return {
            title: {
                name: diskFQNObj[0],
                type: swl.TITLE_CHART_ELEMENT_DISK
            },
            content: {
                iconClass: 'icon-contrail-storage-disk',
                info: [
                    {label: 'Name', value: data['name']},
                    {label:'Total', value: data['total']},
                    {label:'Used', value: data['used']},
                    {label:'Available', value: data['available']},
                    {label:'Avg BW (Read+Write)', value:formatThroughput(data['y'])}
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

    return DashboardView;
});