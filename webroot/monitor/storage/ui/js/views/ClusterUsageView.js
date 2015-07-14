/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var ClusterUsageView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig;
            var selector = $(self.$el),
                clusterUsageTemplate = contrail.getTemplate4Id(swc.TMPL_CLUSTER_USAGE_STATS);

            $(selector).append(clusterUsageTemplate({
                title: swl.TITLE_CLUSTER_USAGE,
                chart1Id: swl.CLUSTER_USAGE_CHART_ID
            }));
            selector = swu.getSelector4Id(swl.CLUSTER_USAGE_CHART_ID);

            cowu.renderView4Config(selector, null, getClusterUsageViewConfig(viewConfig));
        }
    });

    var getClusterUsageViewConfig = function (viewConfig) {

        var clusterUsageViewConfig = {
            elementId: swl.CLUSTER_USAGE_CHART_ID,
            title: swl.TITLE_CLUSTER_USAGE,
            view: "MultiDonutChartView",
            viewConfig: {
                loadChartInChunks: true,
                parseFn: swp.clusterUsageDonutChartParser,
                modelConfig: {
                    modelKey: swc.UMID_CLUSTER_USAGE,
                    vlRemoteConfig: {
                        vlRemoteList: [{
                            getAjaxConfig: function (response) {
                                var lazyAjaxConfig = {
                                    url: swc.URL_POOLS_SUMMARY,
                                    type: 'GET'
                                };
                                return lazyAjaxConfig;
                            },
                            dataParser: swp.clusterReplicaFactorParser,
                            successCallback: function (clusterReplicationFactor, contrailListModel) {
                                var usageSummary = contrailListModel.getItems();
                                contrailListModel.updateData(swp.clusterUsageWithReplicaFactor(usageSummary, clusterReplicationFactor))
                            }
                        }]
                    }
                },
                chartOptions: {
                    outerArc: {
                        tooltipFn: getClusterStatusTooltip
                    },
                    innerArc: {
                        tooltipFn: getClusterUsageTooltip
                    },
                    clickCB: '',//TODO
                    noDataMessage: "Unable to get cluster usage data."
                }
            }
        };
        clusterUsageViewConfig.viewConfig = $.extend(true, {}, clusterUsageViewConfig.viewConfig, viewConfig);

        return clusterUsageViewConfig;
    };

    function getClusterStatusTooltip(currObj) {
        var tooltipContent = {series: []};
        tooltipContent.series.push({
            key: currObj.data.name,
            color: currObj.data.color,
            value: currObj.data.tooltip_data[0].value
        });
        tooltipContent.series.push({
            key: "Status",
            value: currObj.data.status
        });
        return tooltipContent;
    }

    function getClusterUsageTooltip(currObj) {
        var tooltipContent = {series: []};
        tooltipContent.series.push({
            key: currObj.data.name,
            color: currObj.data.color,
            value: currObj.data.tooltip_data[0].value + " (" + currObj.data.tooltip_data[1].value + ")"
        });
        return tooltipContent;
    };

    return ClusterUsageView;
});
