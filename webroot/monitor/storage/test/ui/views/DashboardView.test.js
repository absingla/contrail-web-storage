/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */
define([
    'co-test-constants',
    'co-test-runner',
    'strg-test-utils',
    'strg-test-messages',
    'co-grid-contrail-list-model-test-suite',
    'co-grid-view-test-suite',
    'co-chart-view-line-bar-test-suite',
    'co-chart-view-line-test-suite',
    'strg-dashboard-piechart-custom-test-suite',
    'strg-dashboard-cluster-status-custom-test-suite'
], function (cotc, CUnit, stu, stm, GridListModelTestSuite, GridViewTestSuite, LineWithFocusBarChartViewTestSuite,
    LineWithFocusChartViewTestSuite, CustomTestSuite1, CustomTestSuite2) {

    var moduleId = stm.STORAGE_DASHBOARD_COMMON_TEST_MODULE;
    var testType = cotc.VIEW_TEST;

    var testServerConfig = CUnit.getDefaultTestServerConfig();

    var testServerRoutes = function() {
    
        var routes = [];

        routes.push( {
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/status').toString(),
            fnName: 'clusterStatusMockData'
        });
        
        routes.push( {
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/usage').toString(),
            fnName: 'clusterUsageMockData'
        });

        routes.push( {
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/pools/summary').toString(),
            fnName: 'clusterPoolSummaryMockData'
        });

        routes.push( {
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/osd/status').toString(),
            fnName: 'clusterOSDStatusMockData'
        });
   
        routes.push({
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/ceph/activity').toString(),
            fnName: 'flowSeriesForClusterOsdActivityMockData'
        });
        routes.push({
            url: stu.getRegExForUrl('/api/tenant/storage/cluster/raw/disk/activity').toString(),
            fnName: 'flowSeriesForClusterRawActivityMockData'
        });

        return routes;
    };

    testServerConfig.getRoutesConfig = testServerRoutes;
    testServerConfig.responseDataFile ='monitor/storage/test/ui/views/DashBoardView.mock.data.js';

    var pageConfig = CUnit.getDefaultPageConfig();
    pageConfig.hashParams = {
        p: 'monitor_storage_dashboard',
        q: {
            view: 'dashboard',
            type: 'storage'
        }
    };
    pageConfig.loadTimeout = cotc.PAGE_LOAD_TIMEOUT * 5;

    var getTestConfig = function() {
        return {
            rootView: storagePageLoader.monStorageView,
            tests: [
                {
                    viewId: swl.CLUSTER_CEPH_DISK_ACTIVITY_THRPT_IOPS_CHART_ID,
                    suites: [
                        {
                            class: LineWithFocusBarChartViewTestSuite,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.CLUSTER_CEPH_DISK_ACTIVITY_LATENCY_CHART_ID,
                    suites: [
                        {
                            class: LineWithFocusChartViewTestSuite,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.CLUSTER_RAW_DISK_ACTIVITY_THRPT_IOPS_CHART_ID,
                    suites: [
                        {
                            class: LineWithFocusBarChartViewTestSuite,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.CLUSTER_RAW_DISK_ACTIVITY_LATENCY_CHART_ID,
                    suites: [
                        {
                            class: LineWithFocusChartViewTestSuite,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.POOL_STATS_CHART_ID,
                    suites: [
                        {
                            class: CustomTestSuite1,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.DISK_STATUS_CHART_ID,
                    suites: [
                        {
                            class: CustomTestSuite1,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                },
                {
                    viewId: swl.CLUSTER_STATUS_ID+ '-rtd',
                    suites: [
                        {
                            class: CustomTestSuite2,
                            groups: ['all'],
                            severity: cotc.SEVERITY_LOW
                        }
                    ]
                }
           ]
        } ;

    };

    var pageTestConfig = CUnit.createPageTestConfig(moduleId, testType,testServerConfig, pageConfig, getTestConfig);
    return pageTestConfig;

});
