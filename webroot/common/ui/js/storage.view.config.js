/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view-model'
], function (_, ContrailViewModel) {
    var SViewConfig = function () {
        var self = this;

        self.getTabsViewConfig = function (tabType, elementObj) {
            var config = {};
            switch (tabType) {
                case swc.TAB_ELEMENT_STORAGENODE:
                    var options = {
                        storageNode: elementObj.storageNode
                    };
                    config = {
                        elementId: swl.MONITOR_STORAGENODE_VIEW_ID,
                        view: "StorageNodeTabView",
                        app: cowc.APP_CONTRAIL_STORAGE,
                        viewConfig: options
                    };
                    break;
            }
            return config;
        };

        self.getStorageNodeTabViewConfig = function (viewConfig) {
            var storageNodeName = viewConfig.storageNode,
                tabsToDisplay = viewConfig.tabsToDisplay,
                tabObjs = [];

            var allTabs = [
                {
                    elementId: swl.STORAGENODE_TAB_ID,
                    title: swl.TITLE_STORAGENODE_DETAILS,
                    view: "DiskListView",
                    app: cowc.APP_CONTRAIL_STORAGE,
                    viewConfig: {
                        storageNode: storageNodeName
                    }
                },
            ];

            if (tabsToDisplay == null) {
                tabObjs = allTabs;
            } else if (typeof tabsToDisplay == 'string' || $.isArray(tabsToDisplay)) {
                if (typeof tabsToDisplay == 'string') {
                    tabsToDisplay = [tabsToDisplay];
                }
                for (var i = 0; i < tabsToDisplay.length; i++) {
                    $.each(allTabs, function (idx, obj) {
                        if (obj['view'] == tabsToDisplay[i])
                            tabObjs.push(obj);
                    });
                }
            }

            return {
                elementId: swl.STORAGENODE_TAB_VIEW_ID,
                view: "TabsView",
                viewConfig: {
                    theme: 'classic',
                    active: 1,
                    activate: function (e, ui) {
                        var selTab = $(ui.newTab.context).text();
                        if (selTab == swl.TITLE_STORAGENODE_DETAILS) {
                            $('#' + swl.MONITOR_DISK_GRID_ID).data('contrailGrid').refreshView();
                        }
                    },
                    tabs: tabObjs
                }
            };
        };
    }
    return SViewConfig;
})
