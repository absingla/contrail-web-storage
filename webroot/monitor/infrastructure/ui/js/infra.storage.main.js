/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

var infraStoragePageLoader = new MonitorInfraStorageLoader();

function MonitorInfraStorageLoader() {
    this.load = function (paramObject) {
        var self = this, currMenuObj = globalObj.currMenuObj,
            hashParams = paramObject['hashParams'],
            rootDir = currMenuObj['resources']['resource'][0]['rootDir'],
            pathMSView = rootDir + '/js/views/MonitorInfraStorageView.js',
            renderFn = paramObject['function'];

        check4StorageInit(function () {
            if (self.infraStorageView == null) {
                requirejs([pathMSView], function (MonitorInfraStorageView) {
                    self.infraStorageView = new MonitorInfraStorageView();
                    self.renderView(renderFn, hashParams);
                });
            } else {
                self.renderView(renderFn, hashParams);
            }
        });
    };
    this.renderView = function (renderFn, hashParams) {
        console.log("I am in render view");

        $(contentContainer).html("");
        switch (renderFn) {
            case 'renderStoragenodes':
                if (hashParams.type == "storagenode") {
                    if (hashParams.view == "details") {
                        this.infraStorageView.renderStoragenode({hashParams: hashParams});
                    } else {
                        this.infraStorageView.renderStoragenodeList({hashParams: hashParams});
                    }
                }
                break;

            case 'renderDisks':
                if (hashParams.type == "disk") {
                    this.infraStorageView.renderDiskList({hashParams: hashParams});
                }
                break;
        }
    };
    this.updateViewByHash = function (hashObj, lastHashObj) {
        var renderFn;

        console.log(hashObj);

        if(hashObj.type == "storagenode"){
            renderFn = "renderStoragenodes";
        } else if (hashObj.type == "disk"){
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
