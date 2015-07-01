/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SParsers = function () {
        this.storagenodeDataParser = function (response) {
            var retArr = [], def_topology = {};

            // with multi-backend support, there are different topology output in response.
            // currently only using 'default' type which is the common pool.
            $.each(response.topology, function (idx, topology) {
                if (topology['name'] == 'default') {
                    def_topology = topology;
                } else {
                    def_topology['hosts'] = [];
                }
            });

            $.each(def_topology.hosts, function (idx, host) {
                var obj = {};
                obj['rawData'] = $.extend(true, {}, host);
                obj['available_perc'] = $.isNumeric(host['avail_percent']) ? host['avail_percent'].toFixed(2) : '-';
                obj['total'] = formatBytes(host['kb_total'] * 1024);
                obj['size'] = 1;
                obj['shape'] = 'circle';
                obj['type'] = 'storageNode';
                obj['display_type'] = 'Storage Node';
                obj['name'] = host['name'];
                obj['isPartialUveMissing'] = false;
                obj['osds'] = host['osds'];
                obj['osds_count'] = obj['osds'].length;
                obj['osds_total'] = 0;
                obj['osds_used'] = 0;
                obj['osds_up'] = 0;
                obj['osds_down'] = 0;
                obj['osds_in'] = 0;
                obj['osds_out'] = 0;
                obj['tot_avg_bw'] = 0;
                obj['tot_avg_read_kb'] = 0;
                obj['tot_avg_write_kb'] = 0;
                $.each(host.osds, function (idx, osd) {
                    if (osd.hasOwnProperty('kb') && osd.hasOwnProperty('kb_used')) {
                        obj['osds_total'] += osd['kb'] * 1024;
                        obj['osds_used'] += osd['kb_used'] * 1024;
                    }
                    if (!isEmptyObject(osd['avg_bw'])) {
                        if ($.isNumeric(osd['avg_bw']['reads_kbytes']) && $.isNumeric(osd['avg_bw']['writes_kbytes'])) {
                            obj['tot_avg_bw'] += osd['avg_bw']['reads_kbytes'] + osd['avg_bw']['writes_kbytes'];
                            obj['tot_avg_read_kb'] += osd['avg_bw']['reads_kbytes'];
                            obj['tot_avg_write_kb'] += osd['avg_bw']['writes_kbytes'];
                        } else {
                            osd['avg_bw']['read'] = 'N/A';
                            osd['avg_bw']['write'] = 'N/A';
                        }
                    }
                    if (osd['status'] == 'up')
                        ++obj['osds_up'];
                    else if (osd['status'] == 'down')
                        ++obj['osds_down'];
                    if (osd['cluster_status'] == 'in')
                        ++obj['osds_in'];
                    else if (osd['cluster_status'] == 'out')
                        ++obj['osds_out'];
                });
                obj['osds_status'] = "up: " + obj['osds_up'] + ", down: " + obj['osds_down'] + " / in: " + obj['osds_in'] + ", out: " + obj['osds_out'];
                obj['osds_available_perc'] = swu.calcPercent((obj['osds_total'] - obj['osds_used']), obj['osds_total']);
                obj['x'] = parseFloat((100 - obj['osds_available_perc']).toFixed(2));
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

        this.disksDataParser = function (response) {
            var formattedResponse = [], osdErrArr = [],
                osdChartArr = [], osdArr = [],
                osdUpInArr = [], osdDownArr = [],
                osdUpOutArr = [], skip_osd_bubble = new Boolean(),
                statusTemplate = contrail.getTemplate4Id("disk-status-template"),
                osds;

            if (response != null) {
                osds = response.osds;
                $.each(osds, function (idx, osdObj) {
                    osdObj.rawData = $.extend(true, {}, osdObj);
                    skip_osd_bubble = false;
                    if (osdObj.kb) {
                        osdObj.available_perc = swu.calcPercent(osdObj.kb_avail, osdObj.kb);
                        osdObj.x = parseFloat(100 - osdObj.available_perc);
                        osdObj.gb = swu.kiloByteToGB(osdObj.kb);
                        //osd.y = parseFloat(osd.gb);
                        osdObj.total = formatBytes(osdObj.kb * 1024);
                        osdObj.used = formatBytes(osdObj.kb_used * 1024);
                        osdObj.gb_avail = swu.kiloByteToGB(osdObj.kb_avail);
                        osdObj.gb_used = swu.kiloByteToGB(osdObj.kb_used);
                        osdObj.color = computeOSDColor(osdObj);
                        osdObj.shape = 'circle';
                        osdObj.size = 1;
                    } else {
                        skip_osd_bubble = true;
                        osdObj.gb = 'N/A';
                        osdObj.total = 'N/A';
                        osdObj.used = 'N/A';
                        osdObj.gb_used = 'N/A';
                        osdObj.gb_avail = 'N/A';
                        osdObj.available_perc = 'N/A';
                        osdObj.x = 'N/A';
                    }

                    if (!isEmptyObject(osdObj.avg_bw)) {
                        if ($.isNumeric(osdObj.avg_bw.reads_kbytes) && $.isNumeric(osdObj.avg_bw.writes_kbytes)) {
                            osdObj.y = (osdObj.avg_bw.reads_kbytes + osdObj.avg_bw.writes_kbytes) * 1024;
                            osdObj.tot_avg_bw = formatBytes(osdObj.y);
                            osdObj.avg_bw.read = formatBytes(osdObj.avg_bw.reads_kbytes * 1024);
                            osdObj.avg_bw.write = formatBytes(osdObj.avg_bw.writes_kbytes * 1024);
                        } else {
                            osdObj.tot_avg_bw = 'N/A';
                            osdObj.y = 0;
                            osdObj.avg_bw.read = 'N/A';
                            osdObj.avg_bw.write = 'N/A';
                        }
                    }

                    // osd status template UP/DOWN
                    osdObj.status_tmpl = "<span> " + statusTemplate({ sevLevel: sevLevels['NOTICE'], sevLevels: sevLevels }) + " up</span>";

                    if (osdObj.status == 'down')
                        osdObj.status_tmpl = "<span> " + statusTemplate({ sevLevel: sevLevels['ERROR'], sevLevels: sevLevels }) + " down</span>";

                    // osd cluster membership template IN?OUT
                    osdObj.cluster_status_tmpl = "<span> " + statusTemplate({ sevLevel: sevLevels['INFO'], sevLevels: sevLevels }) + " in</span>";

                    if (osdObj.cluster_status == 'out')
                        osdObj.cluster_status_tmpl = "<span> " + statusTemplate({ sevLevel: sevLevels['WARNING'], sevLevels: sevLevels }) + " out</span>";

                    // Add to OSD scatter chart data of flag is not set
                    if (!skip_osd_bubble) {
                        if (osdObj.status == "up") {
                            if (osdObj.cluster_status == "in") {
                                osdUpInArr.push(osdObj);
                            } else if (osdObj.cluster_status == "out") {
                                osdUpOutArr.push(osdObj);
                            } else {
                            }
                        } else if (osdObj.status == "down") {
                            osdDownArr.push(osdObj);
                        } else {
                        }
                    } else {
                        osdErrArr.push(osdObj.name);
                    }
                    // All OSDs data should be pushed here for List grid
                    osdArr.push(osdObj);
                });

                var upInGroup = {}, upOutGroup = {}, downGroup = {};

                //UP & IN OSDs
                upInGroup.key = "UP & IN ";
                upInGroup.values = osdUpInArr;
                upInGroup.color = swc.DISK_OKAY_COLOR;
                osdChartArr.push(upInGroup);

                //UP & OUT OSDs
                upOutGroup.key = "UP & OUT";
                upOutGroup.values = osdUpOutArr;
                upOutGroup.color = swc.DISK_WARNING_COLOR;
                osdChartArr.push(upOutGroup);

                //Down OSDs
                downGroup.key = "Down";
                downGroup.values = osdDownArr;
                downGroup.color = swc.DISK_ERROR_COLOR;
                osdChartArr.push(downGroup);
            }

            formattedResponse.push({
                disksGrid: osdArr,
                disksChart: osdChartArr,
                disksError: osdErrArr
            });

            return osdArr;
        };
    };


    function computeOSDColor(osd) {
        if (osd['status'] == 'up') {
            if (osd['cluster_status'] == 'in') {
                return swc.DISK_OKAY_COLOR;
            } else if (osd['cluster_status'] == 'out') {
                return swc.DISK_WARNING_COLOR;
            } else {
                return swc.DISK_DEFAULT_COLOR;
            }
        } else if (osd['status'] == 'down') {
            return swc.DISK_ERROR_COLOR;
        }
    };

    return SParsers;
});
