/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var ClusterUsageView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig;
            var selector = $(self.$el),
                clusterUsageTemplate = contrail.getTemplate4Id(swc.TMPL_CLUSTER_USAGE_STATS);

            $(selector).append(clusterUsageTemplate({
                title: swl.TITLE_CLUSTER_USAGE,
                usageChartId: swl.CLUSTER_USAGE_CHART_ID,
                replicaFactorLabelId: swl.CLUSTER_REPLICA_FACTOR_LABEL_ID,
                replicaFactorTitle: swl.TITLE_CLUSTER_REPLICA_FACTOR,
                replicaFactorId: swl.CLUSTER_REPLICA_FACTOR_ID
            }));

            var defaultModelConfig = {
                modelKey: swc.UMID_CLUSTER_USAGE,
                remote: {
                    ajaxConfig: {
                        url: swc.URL_CLUSTER_USAGE,
                        type: 'GET'
                    },
                    dataParser: swp.clusterUsageDataParser
                },
                cacheConfig: {
                    ucid: swc.UCID_CLUSTER_USAGE
                },
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
            };

            viewConfig.modelConfig = $.extend(true, {}, viewConfig.modelConfig, defaultModelConfig);
            self.model = new ContrailListModel(viewConfig.modelConfig);

            if (self.model !== null) {
                if (self.model.loadedFromCache || !(self.model.isRequestInProgress())) {
                    var chartData = self.model.getItems();
                    selector = swu.getSelector4Id(swl.CLUSTER_REPLICA_FACTOR_ID);
                    self.renderReplicaFactor(selector, viewConfig, chartData);
                }

                self.model.onAllRequestsComplete.subscribe(function () {
                    var chartData = self.model.getItems();
                    selector = swu.getSelector4Id(swl.CLUSTER_REPLICA_FACTOR_ID);
                    self.renderReplicaFactor(selector, viewConfig, chartData);
                });
            }

            selector = swu.getSelector4Id(swl.CLUSTER_USAGE_CHART_ID);

            cowu.renderView4Config(selector, self.model, getClusterUsageViewConfig(viewConfig));
        },

        renderReplicaFactor: function(selector, viewConfig, data) {
            $(selector).text(data[0]['cluster_replica_factor']);
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
                chartOptions: {
                    margin: {top: 35, right: 30, bottom: 20, left: 60},
                    height: 150,
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
        tooltipContent.series.push({
            key: "Current Status",
            value: currObj.data.current_status
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
