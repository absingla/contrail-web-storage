/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var SDetailTemplates = function () {
        this.getDiskDetailsTemplate = function (detailTheme, detailActions) {
            var detailTheme = contrail.checkIfExist(detailTheme) ? detailTheme : cowc.THEME_DETAIL_DEFAULT;
            return {
                actions: contrail.handleIfNull(detailActions, []),
                templateGenerator: 'ColumnSectionTemplateGenerator',
                templateGeneratorConfig: {
                    columns: [
                        {
                            class: 'span6',
                            rows: [
                                {
                                    templateGenerator: 'BlockListTemplateGenerator',
                                    title: swl.TITLE_DISK_SUMMARY,
                                    theme: detailTheme,
                                    templateGeneratorConfig: [
                                        {
                                            key: 'name',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'host',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'public_addr',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'status',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'cluster_status',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'total',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'used',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'available',
                                            templateGenerator: 'TextGenerator'
                                        },
                                        {
                                            key: 'uuid',
                                            templateGenerator: 'TextGenerator'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
        };
    };
    return SDetailTemplates;
})
