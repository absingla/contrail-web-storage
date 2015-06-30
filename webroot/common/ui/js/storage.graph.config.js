/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SGraphConfig = function () {
        this.setStoragenodeURLHashParams = function(hashParams, fqName, triggerHashChange) {
            var hashObj = {
                type: "storagenode",
                view: "details",
                focusedElement: {
                    fqName: fqName,
                    type: swc.GRAPH_ELEMENT_STORAGENODE
                }
            }
        }

    };
    return SGraphConfig;
});
