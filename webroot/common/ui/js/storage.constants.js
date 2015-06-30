/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SConstants = function () {
        this.URL_STORAGENODES_SUMMARY = '/api/admin/monitor/infrastructure/storagenodes/summary';
        this.URL_STORAGENODE_DETAILS = '/api/admin/monitor/infrastructure/storagenodes/details?hostname={0}';
        this.URL_DISK_DETAILS = '/api/tenant/storage/cluster/osd/details?name={0}';

        this.pool_prefix = {
            VOLUME  : 'volumes_',
            IMAGE   : 'images_'
        };

        this.pools_name = {
            DEFAULT :  'volumes, images',
            HDD     :  'volumes, images, ' + pool_prefix['VOLUME'] + 'hdd',
            SSD     :  pool_prefix['VOLUME'] + 'ssd'
        };

        this.get = function () {
            var args = arguments;
            return cowu.getValueFromTemplate(args);
        };

        this.UCID_ALL_STORAGENODE_LIST = 'all-storagenodes';

        this.CHART_ELEMENT_STORAGENODE = 'storagenode';

    };
    return SConstants;
});
