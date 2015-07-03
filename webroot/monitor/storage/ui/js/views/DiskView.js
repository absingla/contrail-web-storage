/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var DiskView = Backbone.View.extend({
        el: $(contentContainer),

        render: function() {
            var self = this,
                viewConfig = this.attributes.viewConfig,
                diskName = viewConfig.disk,
                storageNodeName = viewConfig.storageNode;

            self.renderDiskTabs({disk: diskName, storageNode: storageNodeName});
        },

        renderDiskTabs: function(elementObj) {
            var self = this,
                tabConfig = swvc.getTabsViewConfig(swc.TAB_ELEMENT_DISK, elementObj);
            cowu.renderView4Config(self.$el, null, tabConfig, null, null, null);
        }

    });
    return DiskView;
});