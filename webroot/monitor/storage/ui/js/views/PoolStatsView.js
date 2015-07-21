/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var PoolStatsView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this,
                viewConfig = self.attributes.viewConfig,
                selector = $(self.$el);

            cowu.renderView4Config(selector, null, getPoolStatsViewConfig(viewConfig));
        }
    });

    var getPoolStatsViewConfig = function (viewConfig) {

        var poolStatsViewConfig = {
            elementId: swl.POOL_STATS_CHART_ID,
            view: "DonutChartView",
            viewConfig: {
                title: swl.TITLE_POOL_STATS,
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
        };
        poolStatsViewConfig.viewConfig = $.extend(true, {}, poolStatsViewConfig.viewConfig, viewConfig);

        return poolStatsViewConfig;
    };

    function getPoolBarTooltipConfig () {
        //TODO
    };

    return PoolStatsView;
});
