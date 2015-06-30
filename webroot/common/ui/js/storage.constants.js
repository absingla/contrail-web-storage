/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SConstants = function () {
        this.URL_STORAGENODES_SUMMARY = '/api/admin/monitor/infrastructure/storagenodes/summary';
        this.URL_STORAGENODE_DETAILS = '/api/admin/monitor/infrastructure/storagenodes/details?hostname={0}';

        this.URL_DISKS_SUMMARY = '/api/tenant/storage/cluster/osds/summary';
        this.URL_DISK_DETAILS = '/api/tenant/storage/cluster/osd/details?name={0}';

        this.POOL_PREFIX = {
            VOLUME: 'volumes_',
            IMAGE: 'images_'
        };

        this.POOL_NAMES = {
            DEFAULT: 'volumes, images',
            HDD: 'volumes, images, ' + this.POOL_PREFIX['VOLUME'] + 'hdd',
            SSD: this.POOL_PREFIX['VOLUME'] + 'ssd'
        };

        this.get = function () {
            var args = arguments;
            return cowu.getValueFromTemplate(args);
        };

        this.UCID_PREFIX_MS = "monitor-storage";
        this.UCID_PREFIX_CHARTS = "charts";
        this.UCID_PREFIX_LISTS = "lists";
        this.UCID_PREFIX_MS_LISTS = this.UCID_PREFIX_MS + ":" + this.UCID_PREFIX_LISTS + ":";
        this.UCID_PREFIX_MS_CHARTS = this.UCID_PREFIX_MS + ":" + this.UCID_PREFIX_CHARTS + ":";

        this.UCID_ALL_STORAGENODE_LIST = this.UCID_PREFIX_MS_LISTS + 'all-storagenodes';
        this.UCID_ALL_DISK_LIST = this.UCID_PREFIX_MS_LISTS + "all-disks";

        this.CHART_ELEMENT_STORAGENODE = 'storagenode';

        this.color_info = '#1F77B4';
        this.color_success = '#2CA02C';
        this.color_warn = '#FF7F0E';
        this.color_imp = '#D62728';
    };

    return SConstants;
});
