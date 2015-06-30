/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

var swc, swgc, swcc, swl, swu, swm, swp;

require.config({
    baseUrl: '/',
    paths: {
        'storage-constants': 'common/ui/js/storage.constants',
        'storage-grid-config': 'common/ui/js/storage.grid.config',
        'storage-chart-config': 'common/ui/js/storage.chart.config',
        'storage-labels': 'common/ui/js/storage.labels',
        'storage-utils': 'common/ui/js/storage.utils',
        'storage-messages': 'common/ui/js/storage.messages',
        'storage-parsers': 'common/ui/js/storage.parsers',
        'storage-init': 'common/ui/js/storage.init'
    },
    waitSeconds: 0
})