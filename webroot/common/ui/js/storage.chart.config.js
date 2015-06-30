/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SChartConfig = function () {
        this.setStoragenodeURLHashParams = function(hashParams, fqName, triggerHashChange) {
            var hashObj = {
                type: "storagenode",
                view: "details",
                focusedElement: {
                    fqName: fqName,
                    type: swc.CHART_ELEMENT_STORAGENODE
                }
            };

            if(contrail.checkIfKeyExistInObject(true, hashParams, 'clickedElement')) {
                hashObj.clickedElement = hashParams.clickedElement;
            }

            layoutHandler.setURLHashParams(hashObj, {p: "mon_infra_storagemvc", merge: false, triggerHashChange: triggerHashChange});

        };

    };
    return SChartConfig;
});
