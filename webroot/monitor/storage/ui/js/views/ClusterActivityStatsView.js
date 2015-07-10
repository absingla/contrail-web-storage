/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model',
    'js/views/LineWithFocusChartView',
], function (_, Backbone, ContrailListModel, LineWithFocusChartView) {
    var ClusterActivityStatsView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = this.attributes.viewConfig,
                selector = $(self.$el);


            self.initializeChartElementsAndLoadSpinner(selector);

            if (viewConfig.modelConfig != null) {
                self.model = new ContrailListModel(viewConfig['modelConfig']);
                if (self.model.loadedFromCache || !(self.model.isRequestInProgress())) {
                    var chartData = self.model.getItems();
                    self.renderCharts(viewConfig, chartData);
                }

                self.model.onAllRequestsComplete.subscribe(function () {
                    var chartData = self.model.getItems();
                    self.renderCharts(viewConfig, chartData);
                });

                if (viewConfig.loadChartInChunks) {
                    self.model.onDataUpdate.subscribe(function () {
                        var chartData = self.model.getItems();
                        self.renderCharts(viewConfig, chartData);
                    });
                }
            }
        },

        initializeChartElementsAndLoadSpinner: function (selector) {
            var diskActivityStatsTemplate = contrail.getTemplate4Id(swc.TMPL_CLUSTER_DISK_ACTIVITY_STATS),
                loadingSpinnerTemplate = contrail.getTemplate4Id(cowc.TMPL_LOADING_SPINNER);

            $(selector).append(diskActivityStatsTemplate({
                title: "Cluster Activity",
                chart1Id: swl.CLUSTER_DISK_ACTIVITY_THRPT_CHART_ID,
                chart2Id: swl.CLUSTER_DISK_ACTIVITY_IOPS_CHART_ID,
                chart3Id: swl.CLUSTER_DISK_ACTIVITY_LATENCY_CHART_ID
            }));
            /*
             $(selector).append(diskActivityStatsTemplate({
             chartId: swl.CLUSTER_DISK_ACTIVITY_IOPS_CHART_ID
             }));

             $(selector).append(diskActivityStatsTemplate({
             chartId: swl.CLUSTER_DISK_ACTIVITY_LATENCY_CHART_ID
             }));
             */
            $(swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_THRPT_CHART_ID)).append(loadingSpinnerTemplate);
            $(swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_IOPS_CHART_ID)).append(loadingSpinnerTemplate);
            $(swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_LATENCY_CHART_ID)).append(loadingSpinnerTemplate);

        },

        renderCharts: function (viewConfig, chartData) {
            var lineWithFocusChartView = new LineWithFocusChartView(),
                selector, add2ViewConfig, yFormatterFn;
            /**
             * Cluster wide Disk Activity Throughput line chart
             */
            selector = swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_THRPT_CHART_ID);
            add2ViewConfig = {
                chartOptions: {
                    height: 200,
                    yAxisLabel: swl.CLUSTER_DISK_ACTIVITY_THRPT_CHART_YAXIS_LABEL
                },
                parseFn: swp.diskActivityThrptLineChartDataParser
            }
            var viewConfig = $.extend(true, {}, viewConfig, add2ViewConfig);
            lineWithFocusChartView.renderChart(selector, viewConfig, chartData);

            /**
             * Cluster wide Disk Activity IOPs line chart
             */
            selector = swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_IOPS_CHART_ID);
            yFormatterFn = function (d) {
                return swu.addUnits2IOPs(d, false, false, 1);
            };
            add2ViewConfig = {
                chartOptions: {
                    height: 200,
                    yAxisLabel: swl.CLUSTER_DISK_ACTIVITY_IOPS_CHART_YAXIS_LABEL,
                    yFormatter: yFormatterFn,
                    y2Formatter: yFormatterFn
                },
                parseFn: swp.diskActivityIOPsLineChartDataParser
            }
            var viewConfig = $.extend(true, {}, viewConfig, add2ViewConfig);
            lineWithFocusChartView.renderChart(selector, viewConfig, chartData);

            /**
             * Cluster wide Disk Activity Latency line chart
             */
            selector = swu.getSelector4Id(swl.CLUSTER_DISK_ACTIVITY_LATENCY_CHART_ID);
            yFormatterFn = function (d) {
                return swu.addUnits2Latency(d, false, false, 1);
            };
            add2ViewConfig = {
                chartOptions: {
                    height: 200,
                    yAxisLabel: swl.CLUSTER_DISK_ACTIVITY_LATENCY_CHART_YAXIS_LABEL,
                    yFormatter: yFormatterFn,
                    y2Formatter: yFormatterFn
                },
                parseFn: swp.diskActivityLatencyLineChartDataParser
            }
            var viewConfig = $.extend(true, {}, viewConfig, add2ViewConfig);
            lineWithFocusChartView.renderChart(selector, viewConfig, chartData);
        }

    });

    return ClusterActivityStatsView;
});
