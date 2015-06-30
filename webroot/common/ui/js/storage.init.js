/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'storage-constants',
    'storage-grid-config',
    'storage-graph-config',
    'storage-labels',
    'storage-utils',
    'storage-messages',
    'storage-parsers'
], function (_, Constants, GridConfig, GraphConfig, Labels, Utils, Messages, Parsers) {
    swc = new Constants();
    swgc = new GridConfig();
    swgrc = new GraphConfig();
    swl = new Labels();
    swu = new Utils();
    swm = new Messages();
    swp = new Parsers();
    sInitComplete = true;
});