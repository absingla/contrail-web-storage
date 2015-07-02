/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

var storagePageLoader = new MonitorStorageLoader();

function MonitorStorageLoader() {
    this.load = function (paramObject) {
        var self = this, currMenuObj = globalObj.currMenuObj,
            hashParams = paramObject['hashParams'],
            rootDir = currMenuObj['resources']['resource'][0]['rootDir'],
            pathMSView = rootDir + '/js/views/MonitorStorageView.js',
            renderFn = paramObject['function'];

        check4StorageInit(function () {
            if (self.monStorageView == null) {
                requirejs([pathMSView], function (MonitorStorageView) {
                    self.monStorageView = new MonitorStorageView();
                    self.renderView(renderFn, hashParams);
                });
            } else {
                self.renderView(renderFn, hashParams);
            }
        });
    };
    this.renderView = function (renderFn, hashParams) {
        $(contentContainer).html("");
        switch (renderFn) {
            case 'renderDisks':
                if (hashParams.type == "disk") {
                    this.monStorageView.renderDiskList({hashParams: hashParams});
                }
                break;
        }
    };
    this.updateViewByHash = function (hashObj, lastHashObj) {
        var renderFn;

        if (hashObj.type == "disk"){
            renderFn = "renderDisks";
        } else if (hashObj.type == "monitor"){
            renderFn = "renderMonitors";
        } else if (hashObj.type == "dashboard"){
            renderFn = "renderDashboard";
        }

        this.load({hashParams: hashObj, 'function': renderFn});
    };

    this.destroy = function () {
    };
};