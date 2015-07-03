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
            cowu.renderView4Config(this.$el, null, getStorageNodeViewConfig(hashParams));
        },

        renderStoragenodeList: function () {
            cowu.renderView4Config(this.$el, null, getStoragenodeListConfig());
        },

        renderDisk: function (viewConfig) {
            var self = this,
                hashParams = viewConfig.hashParams,
                fqName = (contrail.checkIfKeyExistInObject(true, hashParams, 'focusedElement.fqName') ? hashParams.focusedElement.fqName : null);

            //TBD breadcrumb update

            cowu.renderView4Config(self.$el, null, getDiskViewConfig(hashParams));
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

    function getStorageNodeViewConfig(hashParams) {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_STORAGENODE_VIEW_ID]),
            view: "StorageNodeView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {
                storageNode: hashParams.focusedElement.fqName
            }
        }
    };

    function getDiskViewConfig(hashParams) {
        return {
            elementId: cowu.formatElementId([swl.MONITOR_DISK_VIEW_ID]),
            view: "DiskView",
            app: cowc.APP_CONTRAIL_STORAGE,
            viewConfig: {
                disk: hashParams.focusedElement.fqName,
                storageNode: hashParams.focusedElement.fqHost
            }
        };
    }

    return MonitorStorageView;
});