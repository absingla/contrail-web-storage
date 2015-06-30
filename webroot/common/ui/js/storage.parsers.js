/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SParsers = function () {
        this.storagenodeDataParser = function (response) {
            var retArr = [],
                def_topology = {};

            /*
             * with multi-backend support, there are different topology output in response.
             * currently only using 'default' type which is the common pool.
             */
            $.each(response.topology, function (idx, topology) {
                if (topology['name'] == 'default') {
                    def_topology = topology;
                } else {
                    def_topology['hosts'] = [];
                }
            });

            $.each(def_topology.hosts, function (idx, host) {
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

        this.disksDataParser = function (response) {
            var formattedResponse = [],
                osdErrArr = [],
                osdChartArr = [],
                osdArr = [],
                osdUpInArr = [],
                osdDownArr = [],
                osdUpOutArr = [],
                skip_osd_bubble = new Boolean(),
                statusTemplate = contrail.getTemplate4Id("disk-status-template");

            if (response != null) {
                var osds = response.osds;
                $.each(osds, function (idx, osd) {
                    skip_osd_bubble = false;

                    if (osd.kb) {
                        osd.available_perc = swu.calcPercent(osd.kb_avail, osd.kb);
                        osd.x = parseFloat(100 - osd.available_perc);
                        osd.gb = swu.kiloByteToGB(osd.kb);
                        //osd.y = parseFloat(osd.gb);
                        osd.total = formatBytes(osd.kb * 1024);
                        osd.used = formatBytes(osd.kb_used * 1024);
                        osd.gb_avail = swu.kiloByteToGB(osd.kb_avail);
                        osd.gb_used = swu.kiloByteToGB(osd.kb_used);
                        osd.color = getOSDColor(osd);
                        osd.shape = 'circle';
                        osd.size = 1;
                    } else {
                        skip_osd_bubble = true;
                        osd.gb = 'N/A';
                        osd.total = 'N/A';
                        osd.used = 'N/A';
                        osd.gb_used = 'N/A';
                        osd.gb_avail = 'N/A';
                        osd.available_perc = 'N/A';
                        osd.x = 'N/A';
                    }
                    if (!isEmptyObject(osd.avg_bw)) {
                        if ($.isNumeric(osd.avg_bw.reads_kbytes) && $.isNumeric(osd.avg_bw.writes_kbytes)) {
                            osd.y = (osd.avg_bw.reads_kbytes + osd.avg_bw.writes_kbytes) * 1024;
                            osd.tot_avg_bw = formatBytes(osd.y);
                            osd.avg_bw.read = formatBytes(osd.avg_bw.reads_kbytes * 1024);
                            osd.avg_bw.write = formatBytes(osd.avg_bw.writes_kbytes * 1024);
                        } else {
                            osd.tot_avg_bw = 'N/A';
                            osd.y = 0;
                            osd.avg_bw.read = 'N/A';
                            osd.avg_bw.write = 'N/A';
                        }
                    }
                    /**
                     * osd status template UP?DOWN
                     */
                    osd.status_tmpl = "<span> " + statusTemplate({
                            sevLevel: sevLevels['NOTICE'],
                            sevLevels: sevLevels
                        }) + " up</span>";
                    if (osd.status == 'down')
                        osd.status_tmpl = "<span> " + statusTemplate({
                                sevLevel: sevLevels['ERROR'],
                                sevLevels: sevLevels
                            }) + " down</span>";
                    /**
                     * osd cluster membership template IN?OUT
                     */
                    osd.cluster_status_tmpl = "<span> " + statusTemplate({
                            sevLevel: sevLevels['INFO'],
                            sevLevels: sevLevels
                        }) + " in</span>";
                    if (osd.cluster_status == 'out')
                        osd.cluster_status_tmpl = "<span> " + statusTemplate({
                                sevLevel: sevLevels['WARNING'],
                                sevLevels: sevLevels
                            }) + " out</span>";

                    // Add to OSD scatter chart data of flag is not set
                    if (!skip_osd_bubble) {
                        if (osd.status == "up") {
                            if (osd.cluster_status == "in") {
                                osdUpInArr.push(osd);
                            } else if (osd.cluster_status == "out") {
                                osdUpOutArr.push(osd);
                            } else {
                            }
                        } else if (osd.status == "down") {
                            osdDownArr.push(osd);
                        } else {
                        }
                    } else {
                        osdErrArr.push(osd.name);
                    }
                    // All OSDs data should be pushed here for List grid
                    osdArr.push(osd);
                });

                var upInGroup = {}, upOutGroup = {}, downGroup = {};
                //UP & IN OSDs
                upInGroup.key = "UP & IN ";
                upInGroup.values = osdUpInArr;
                upInGroup.color = swc.color_success;
                osdChartArr.push(upInGroup);
                //UP & OUT OSDs
                upOutGroup.key = "UP & OUT";
                upOutGroup.values = osdUpOutArr;
                upOutGroup.color = swc.color_warn;
                osdChartArr.push(upOutGroup);
                //Down OSDs
                downGroup.key = "Down";
                downGroup.values = osdDownArr;
                downGroup.color = swc.color_imp;
                osdChartArr.push(downGroup);
            }

            formattedResponse.push({
                disksGrid: osdArr,
                disksChart: osdChartArr,
                disksError: osdErrArr
            });

            console.log(osdArr);

            return osdArr;
        };
    };


    function getOSDColor(d, obj) {
        if (d['status'] == 'up') {
            if (d['cluster_status'] == 'in')
                return d3Colors['green'];
            else if (d['cluster_status'] == 'out')
                return d3Colors['orange']
            else
                return d3Colors['blue']
        } else if (d['status'] == 'down')
            return d3Colors['red']
        else {}
    };

    return SParsers;
});
