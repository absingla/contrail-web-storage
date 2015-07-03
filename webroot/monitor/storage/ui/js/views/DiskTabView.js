/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var DiskTabView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this, viewConfig = this.attributes.viewConfig,
                modelMap = contrail.handleIfNull(this.modelMap, {});

            cowu.renderView4Config(self.$el, null, swvc.getDiskTabViewConfig(viewConfig), null, null, modelMap);
        }
    });

    return DiskTabView;
});
