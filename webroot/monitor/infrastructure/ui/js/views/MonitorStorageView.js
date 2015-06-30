/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    './StorageBreadcrumbView.js'
], function (_, Backbone, BreadcrumbView) {
    var MonitorStorageView = Backbone.View.extend({
        el: $(contentContainer),

        renderStoragenode: function (viewConfig) {
            var self = this,
                hashParams = viewConfig.hashParams,
                fqName = (contrail.checkIfKeyExistInObject(true, hashParams, 'focusedElement.fqName') ? hashParams.focusedElement.fqName : null),
                breadcrumbView = new BreadcrumbView();

            breadcrumbView.renderDomainBreadcrumbDropdown(fqName, function (domainSelectedValueData, domainBreadcrumbChanged) {

            });
        },

        renderStoragenodeList: function () {
            cowu.renderView4Config(this.$el, null, getStoragenodeListConfig());
        }

    });

    function getStoragenodeListConfig() {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGENODE_LIST_PAGE_ID]),
            view: "StoragenodeListView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {}
        }
    };

    return MonitorStorageView;
});