/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SParsers = function () {
        this.storagenodeDataParser = function(response) {
            var retArr = [],
                def_topology = {};

            /*
             * with multi-backend support, there are different topology output in response.
             * currently only using 'default' type which is the common pool.
             */
            $.each(response.topology, function(idx, topology) {
                if (topology['name'] == 'default') {
                    def_topology = topology;
                } else {
                    def_topology['hosts'] = [];
                }
            });

            $.each(def_topology.hosts, function(idx, host) {
                var obj = {};
                obj['available_perc'] = $.isNumeric(host['avail_percent']) ? host['avail_percent'].toFixed(2) : '-';
                obj['total'] = formatBytes(host['kb_total'] * 1024);
                obj['size'] = 1;
                obj['shape'] = 'circle';
                obj['type'] = 'storageNode';
                obj['display_type'] = 'Storage Node';
                obj['name'] = host['name'];
                obj['isPartialUveMissing'] = false;
                obj['osds'] = host['osds'];
                obj['osds_total'] = 0;
                obj['osds_used'] = 0;
                obj['tot_avg_bw'] = 0;
                obj['tot_avg_read_kb'] = 0;
                obj['tot_avg_write_kb'] = 0;
                $.each(host.osds, function(idx, osd) {
                    if (osd.hasOwnProperty('kb') && osd.hasOwnProperty('kb_used')) {
                        obj['osds_total'] += osd['kb'] * 1024;
                        obj['osds_used'] += osd['kb_used'] * 1024;
                    }
                    if (!isEmptyObject(osd['avg_bw'])){
                        if($.isNumeric(osd['avg_bw']['reads_kbytes']) && $.isNumeric(osd['avg_bw']['writes_kbytes'])){
                            obj['tot_avg_bw'] += osd['avg_bw']['reads_kbytes'] + osd['avg_bw']['writes_kbytes'];
                            obj['tot_avg_read_kb'] += osd['avg_bw']['reads_kbytes'];
                            obj['tot_avg_write_kb'] += osd['avg_bw']['writes_kbytes'];
                        } else {
                            osd['avg_bw']['read'] = 'N/A';
                            osd['avg_bw']['write'] = 'N/A';
                        }
                    }
                });
                obj['osds_available_perc'] = swu.calcPercent((obj['osds_total'] - obj['osds_used']), obj['osds_total']);
                obj['x'] = parseFloat((100 - obj['osds_available_perc']).toFixed(2));
                //obj['y'] = parseFloat(byteToGB(obj['osds_total']));
                obj['y'] = parseFloat(obj['tot_avg_bw'].toFixed(2)) * 1024;
                obj['osds_available'] = formatBytes(obj['osds_total'] - obj['osds_used']);
                obj['osds_total'] = formatBytes(obj['osds_total']);
                obj['osds_used'] = formatBytes(obj['osds_used']);
                obj['monitor'] = host['monitor'];
                obj['status'] = host['status'];
                //obj['color'] = swu.getStorageNodeColor(host, obj);
                obj['downNodeCnt'] = 0;
                //initialize for alerts
                obj['isDiskDown'] = obj['isDiskOut'] = false;
                obj['nodeAlerts'] = swu.processStorageNodeAlerts(obj);
                obj['alerts'] = obj['nodeAlerts'].sort(dashboardUtils.sortInfraAlerts);
                //currently we are not tracking any storage process alerts.
                obj['processAlerts'] = [];
                /*
                 * build_info response holds version string or could be empty array.
                 */
                if (host['build_info'].length > 0) {
                    var versionArr = host['build_info'].split(" ");
                    obj['version'] = "Ceph " + versionArr[2];
                } else {
                    obj['version'] = "Ceph N/A";
                }
                if (obj['color'] == d3Colors['red']) {
                    obj['downNodeCnt']++;
                }
                retArr.push(obj);
            });

            /*
             * Cluster health is getting passed from storage nodes summary API.
             * separate object entry is created with name CLUSTER_HEALTH so it can be filtered out
             * for charts and other cases that only require storage node details.
             */
            var clusterObj = {};
            clusterObj['name'] = 'CLUSTER_HEALTH';
            clusterObj['nodeAlerts'] = swu.processStorageHealthAlerts(response['cluster_status']);
            clusterObj['alerts'] = clusterObj['nodeAlerts'].sort(dashboardUtils.sortInfraAlerts);
            clusterObj['processAlerts'] = [];
            /*
             * total monitor count to display on the infobox.
             * this includes monitor only and storage + monitor nodes.
             */
            clusterObj['monitor_count'] = response['cluster_status']['monitor_count'];
            clusterObj['monitor_active'] = response['cluster_status']['monitor_active'];
            //adding clusterObj to the top of the returned array
            //retArr.unshift(clusterObj);

            retArr.sort(dashboardUtils.sortNodesByColor);
            return retArr;
        };

    };
    return SParsers;
});
