/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-view-model'
], function (_, Backbone, ContrailViewModel) {
    var StorageNodeTabView = Backbone.View.extend({
        el: $(contentContainer),

        render: function () {
            var self = this, viewConfig = this.attributes.viewConfig,
                modelMap = contrail.handleIfNull(this.modelMap, {});

            cowu.renderView4Config(self.$el, null, swvc.getStorageNodeTabViewConfig(viewConfig), null, null, modelMap);
        }
    });

    return StorageNodeTabView;
});
