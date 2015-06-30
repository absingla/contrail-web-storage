/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-list-model'
], function (_, Backbone, ContrailListModel) {
    var BreadcrumbView = Backbone.View.extend({

        renderDomainBreadcrumbDropdown: function(fqName, initCB, changeCB) {

        }

    });

    var populateDomainBreadcrumbDropdown = function(contrailListModel, fqName, initCB, changeCB) {
        var dropdownData = contrailListModel.getItems();

        if (dropdownData.length > 0) {

        } else {
            //TODO - Empty message - that.$el.html(ctwm.NO_PROJECT_FOUND);
        }

    };

    var constructBreadcrumbDropdownDOM = function(breadcrumbDropdownId) {
        var breadcrumbElement = $('#breadcrumb'); //TODO - move to constants

        destroyBreadcrumbDropdownDOM(breadcrumbDropdownId);

        breadcrumbElement.children('li').removeClass('active');
        breadcrumbElement.children('li:last').append('<span class="divider"><i class="icon-angle-right"></i></span>');
        breadcrumbElement.append('<li class="active ' + breadcrumbDropdownId +'"><div id="' + breadcrumbDropdownId + '"></div></li>');

        return $('#' + breadcrumbDropdownId);
    };

    var destroyBreadcrumbDropdownDOM = function(breadcrumbDropdownId){
        if (contrail.checkIfExist($('#' + breadcrumbDropdownId).data('contrailDropdown'))) {
            $('#' + breadcrumbDropdownId).data('contrailDropdown').destroy();
            if($('li.' + breadcrumbDropdownId).hasClass('active')) {
                $('li.' + breadcrumbDropdownId).prev().addClass('active')
            }
            $('li.' + breadcrumbDropdownId).prev().find('.divider').remove();
            $('li.' + breadcrumbDropdownId).remove();
        }
    };

    return BreadcrumbView;
});