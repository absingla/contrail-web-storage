/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'contrail-list-model'
], function (_, ContrailView, ContrailListModel) {
    var DiskListView = ContrailView.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig,
                storageNodeName = viewConfig['storageNode'];

            var listModelConfig = {
                remote: {
                    ajaxConfig: {
                        url: storageNodeName != null ? swc.get(swc.URL_STORAGENODE_DISKS, storageNodeName) : swc.URL_DISKS_SUMMARY,
                        type: "GET"
                    },
                    dataParser: swp.disksDataParser
                },
                cacheConfig: {
                    ucid: storageNodeName != null ? (swc.UCID_PREFIX_MS_LISTS + storageNodeName + ":disks") : swc.UCID_ALL_DISK_LIST
                }
            };

            var contrailListModel = new ContrailListModel(listModelConfig);
            self.renderView4Config(self.$el, contrailListModel, getDiskListViewConfig());
        }
    });

    function getDiskListViewConfig() {
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
                                        xLabelFormat: d3.format(".01f"),
                                        forceX: [0, 1],
                                        yLabel: 'Avg. Bandwidth [R + W] ',
                                        yLabelFormat: function (yValue) {
                                            var formattedValue = formatThroughput(yValue, true);
                                            return formattedValue;
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
                                elementId: swl.MONITOR_DISKS_ID,
                                title: swl.TITLE_DISKS,
                                view: "DiskGridView",
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

    function onScatterChartClick(chartConfig) {
        var diskFQN = chartConfig['name'],
            storagenodeFQN = chartConfig['host'];
        swcc.setDiskURLHashParams(null, {fqName: diskFQN, fqHost: storagenodeFQN}, true);
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
                    {label: 'Total', value: data['total']},
                    {label: 'Used', value: data['used']},
                    {label: 'Available', value: data['available']},
                    {label: 'Avg BW (Read+Write)', value: formatThroughput(data['y'])}
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

    return DiskListView;
});