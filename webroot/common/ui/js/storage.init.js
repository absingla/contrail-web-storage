/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'storage-constants',
    'storage-grid-config',
    'storage-chart-config',
    'storage-labels',
    'storage-utils',
    'storage-messages',
    'storage-parsers',
    'storage-view-config'
], function (_, Constants, GridConfig, ChartConfig, Labels, Utils, Messages, Parsers, ViewConfig) {
    swc = new Constants();
    swgc = new GridConfig();
    swcc = new ChartConfig();
    swl = new Labels();
    swu = new Utils();
    swm = new Messages();
    swp = new Parsers();
    swvc = new ViewConfig();
    sInitComplete = true;
});