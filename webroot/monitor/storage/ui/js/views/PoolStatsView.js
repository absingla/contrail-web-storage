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
                viewConfig = self.attributes.viewConfig;
            var selector = $(self.$el),
                poolStatsTemplate = contrail.getTemplate4Id(swc.TMPL_POOL_STATS);

            $(selector).append(poolStatsTemplate({
                title: swl.TITLE_POOL_STATS,
                chart1Id: swl.POOL_BAR_CHART_ID
            }));
            selector = swu.getSelector4Id(swl.POOL_BAR_CHART_ID);

            cowu.renderView4Config(selector, null, getPoolStatsViewConfig(viewConfig));
        }
    });

    var getPoolStatsViewConfig = function (viewConfig) {

        var poolStatsViewConfig = {
            elementId: swl.POOL_BAR_CHART_ID,
            title: swl.TITLE_POOLS,
            view: "HorizontalBarChartView",
            viewConfig: {
                loadChartInChunks: true,
                parseFn: swp.poolsBarChartDataParser,
                chartOptions: {
                    xAxisLabel: '',
                    yAxisLabel: '',
                    height: 150,
                    showLegend: true,
                    tooltipConfigCB: getPoolBarTooltipConfig,
                    clickCB: '',//TODO
                    noDataMessage: "Unable to get pool data."
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
