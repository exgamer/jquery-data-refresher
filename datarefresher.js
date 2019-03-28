/**
 * Плагин для обновления HTML контента
 *
 * требует jquery и плагин bPopup
 *
 *
 * Пример вызова для обновления HTMl элемента
 * можно указать несколько dataContainerId через запятую
 *
 * $( ".button").dataRefresher('update', {'dataUrl': '/index', 'dataContainerId': 'blockToRefresh'});
 *
 *
 * Пример вызова для реализации бесконечного списка
 *
 * $( ".button").dataRefresher('infinitePager', {'dataUrl': '/index', 'dataContainerId': 'list'});
 *
 *
 * Пример показа модального окна с подгрузкой контента
 *
 * 	$( ".button").dataRefresher('showModal', {
 *		 'formHtmlUrl' : "index//getmodalhtml/",
 *	     'modalTitle' : $(this).attr('data-modal-title'),
 *	});
 *
 *Пример показа модального окна с формой
 * можно указать несколько dataContainerId через запятую
 *
 * $( ".button").dataRefresher('showModalForm', {
 *	 'formHtmlUrl' : 'get/form/html',
 *	 'dataUrl' : 'get/refresh/block/data/html',
 * 	 'dataContainerId' : 'refresh-block-id',
 *   'modalTitle' : 'modal form',
 * });
 *
 *
 *   Пример сабмита формы через ajax
 *
 *    $( this).dataRefresher('refresherForm', {
 *           'formHtmlUrl' : $(this).attr('data-form-url'),
 *           'dataUrl' : $(this).attr('data-refresh-block-url'),
 *           'dataContainerId' : $(this).attr('data-refresh-block-id'),
 *           'modalTitle' : $(this).attr('data-modal-title'),
 *           'formSuccessCallback': function (data) {
 *               if(data.data !== undefined && data.data.redirectUrl !== undefined) {
 *                   location.href = data.data.redirectUrl;
 *               }
 *           },
 *           'formCompleteCallback': function () {
 *               $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').each(function () {
 *                   if ($(this).val() || $(this).text()) {
 *                       $(this).addClass('active');
 *                   } else {
 *                       $(this).removeClass('active');
 *                  }
 *               });
 *             $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').off('blur');
 *               $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').on('blur', function () {
 *                   if ($(this).val() || $(this).text()) {
 *                       $(this).addClass('active');
 *                   } else {
 *                       $(this).removeClass('active');
 *                   }
 *               });
 *           },
 *           'completeCallback': function () {
 *               if(typeof donutValues !== 'undefined'){
 *                   intel.complaint.processDonutValues(donutValues)
 *               }
 *           }
 *       });
 *
 *
 * settings['formDataUrl'] - url на который будет послан GET запрос для получения html формы
 * settings['formSendUrl'] - url на который будет послан POST запрос c данными формы (если не указан будет использован settings['formDataUrl'])
 * settings['formSuccessCallback'] - пользовательская функция которая выполнится по успешному выполнению запроса  от settings['formDataUrl'] или settings['formSendUrl']
 * settings['formCompleteCallback'] - пользовательская функция которая выполнится по выполнению запроса в любом случае от settings['formDataUrl'] или settings['formSendUrl']
 * settings['dataUrl'] - url на который будет послан GET запрос для получения обновленных данных в блоке settings['dataContainerId']
 *
 * settings['dataContainerId'] - id HTML элемента который будет обновлен данными из settings['dataUrl'], можно указать несколько id через запятую для update, showModalForm
 * settings['pagerButtonClass'] - class элемента HTML, который является триггером для обновления бесконечго списка
 * settings['loaderClass'] - class элемента HTML, который покажется при запросе
 * settings['beforeSendCallback'] - пользовательская функция которая выполнится перед запросом settings['dataUrl']
 * settings['successCallback'] - пользовательская функция которая выполнится в случае успешного ответа settings['dataUrl']
 * settings['completeCallback'] - пользовательская функция которая выполнится  по выполнению запроса в любом случае settings['dataUrl']
 *
 * settings['modalHtml'] - HTML разметка модального окна (пример в феолтном значении)
 * settings['modalId'] - id модального окна
 * settings['modalCloseClass'] - класс элемента закрывающего модальное окно
 * settings['modalTitleClass'] - class элемента title модального окна
 * settings['modalTitle'] - title модального окна
 * settings['modalBodyId'] - id HTML элемента который будет обновлен данными из settings['formDataUrl'] или settings['formSendUrl']
 *
 * @param settings настройки плагина
 *
 *
 * @author citizenzet exgamer@live.ru
 */
(function( $ ) {
    var settings = {
        'formHtmlUrl' : undefined,
        'formSendUrl' : undefined,
        'dataUrl' : undefined,
        'dataContainerId' : undefined,
        'pagerButtonClass' : 'js-infinite',
        'loaderClass' : 'js-loader',
        'beforeSendCallback' : undefined,
        'successCallback' : undefined,
        'completeCallback' : undefined,
        'formSuccessCallback' : undefined,
        'formCompleteCallback' : undefined,
        'modalHtml' :  "    <div id=\"{%modal-id%}\" class=\"add-review-popup modal popup block\">\n" +
                    "        <div class=\"header block-section\"><span class=\"{%modal-title-class%}\">{%modal-title-caption%}</span>\n" +
                "            <a class=\"{%modal-close-class%}\" href=\"#\"><i class=\"icon icon-close\"></i></a>\n" +
                "        </div>\n" +
                "        <div id='{%modal-body-id%}'>\n" +
                "        {%modal-body%}" +
                "        </div>" +
                "    </div>",
        "modalId": "js-magic-modal",
        "modalCloseClass": "close-popup",
        'modalOnCloseCallback' : undefined,
        "modalTitleClass": "modal-title",
        "modalTitle": "modal title",
        "modalBodyId": "js-modal-body",
    };

    /**
     * Выполнение анонимной функции
     * @param callback
     * @param data
     */
    var doCallback = function (callback, data) {
        if(callback != undefined && typeof callback == 'function'){
            eval(callback)(data);
        }
    }

    /**
     * Обновление DOM элементов из ответа с сервера
     * @param responseHtml
     * @param selector
     * @returns {*|jQuery}
     */
    var updateDomElement = function(responseHtml, selector)
    {
        var ids = [];
        var content = [];
        var arrayOfSelectors = selector.split(",");
        arrayOfSelectors.forEach(function(element) {
            ids.push( '#' + element.trim());
            content.push(getHtml(responseHtml, '#' + element.trim()));
        });
        ids.forEach(function(element, index) {
            if (content[index] != undefined){
                $(element).html(content[index]);
            }else{
                $(element).html("");
            }
        });
    };

    /**
     * Проверяем есть ли в html элемент с селектором если есть возвращаем его тело
     * @param html
     * @param selector
     * @returns {*}
     */
    var getHtml = function(html, selector)
    {
        var dom = $(html);
        var container = dom.find(selector);
        if (container.length == 0 ){
            return undefined;
        }

        return container.html();
    };

    /**
     *  Метод получает с url данные и выполняет callback
     * @param url
     * @param method
     * @param postData
     * @param beforeSendCallback
     * @param successCallback
     * @param completeCallback
     */
    var updateData = function(url, method, postData, beforeSendCallback, successCallback, completeCallback)
    {
        $.ajax({
            type: method,
            url: url,
            data: postData,
            // dataType: 'json',
            beforeSend: function() {
                doCallback(beforeSendCallback);
            },
            success: function(data) {
                doCallback(successCallback, data);
            },
            error: function(xhr) { // if error occured

            },
            complete: function() {
                doCallback(completeCallback);
            }
        });
    };

    /**
     * Обработчик формы
     *
     * @param formContainerId
     * @param isModal
     */
    var submitForm = function(form, isModal = true)
    {
            var formSendUrl = form.attr('action');
            if (settings['formSendUrl'] != undefined){
                formSendUrl = settings['formSendUrl'];
            }
            updateData(
                formSendUrl,
                "POST",
                form.serialize(),
                function( ){
                    /**
                     * Вырубаем кнопку сабмита перед запросом
                     */
                    var buttons = form.find("[type='submit']");
                    if(buttons.length > 0) {
                        buttons.attr('disabled', 'disabled');
                    }
                },
                function(data){
                    /**
                     * Если ответ содержит форму значит нужно обновить ее,
                     * если нет закрываем окно
                     */
                    var $responseDom = $('<div/>').html(data);
                    var $responseForm = $responseDom.find('form');
                    if ($responseForm.length > 0){
                        form.replaceWith($responseForm);
                    }else {
                        if (isModal) {
                            /**
                             * Закрываем модальное окно
                             */
                            $('#' +  settings['modalId']).bPopup().close();
                        }
                        /**
                         * Если указан settings['dataUrl'] и settings['dataContainerId'] делаем запрос и обновляем блок
                         */
                        if (settings['dataUrl'] != undefined && settings['dataContainerId'] != undefined){
                            updateData(
                                settings['dataUrl'],
                                "GET",
                                {},
                                function( ){
                                    doCallback(settings['beforeSendCallback']);
                                },
                                function(data){
                                    updateDomElement(data, settings['dataContainerId']);
                                    doCallback(settings['successCallback'], data);
                                },
                                function(){
                                    doCallback(settings['completeCallback']);
                                },
                            );
                        }
                    }
                    doCallback(settings['formSuccessCallback'], data);
                },
                function(){
                    doCallback(settings['formCompleteCallback']);
                },
            );
    };

    /**
     * Показать модалку с формой
     *
     * $( this).dataRefresher('showModalForm', {
	 *	 'formHtmlUrl' : 'get/form/html',
	 *	 'dataUrl' : 'get/refresh/block/data/html',
	 * 	 'dataContainerId' : 'refresh-block-id',
	 *   'modalTitle' : 'modal form',
	 * });
     */
    var showModalForm = function(modalBody)
    {
        var modalId = settings['modalId'];
        showModal(modalBody);
        $(document).off('submit', '#' + modalId + ' form');
        $(document).on('submit', '#' + modalId + ' form', function(event) {
            event.preventDefault();
            var form = $(this);
            submitForm(form, true);
        });
    };

    /**
     * Показать модалку
     */
    var showModal = function(modalBody)
    {
        var modalHtml = settings['modalHtml'];
        var modalId = settings['modalId'];
        var modalCloseClass = settings['modalCloseClass'];
        var modalTitleClass = settings['modalTitleClass'];
        var modalTitle = settings['modalTitle'];
        var modalBodyId = settings['modalBodyId'];
        var modalOnCloseCallback = settings['modalOnCloseCallback'];
        $("#" + modalId).remove();
        modalHtml = modalHtml.replace("{%modal-id%}", modalId);
        modalHtml = modalHtml.replace("{%modal-close-class%}", modalCloseClass);
        modalHtml = modalHtml.replace("{%modal-title-class%}", modalTitleClass);
        modalHtml = modalHtml.replace("{%modal-body%}", modalBody);
        modalHtml = modalHtml.replace("{%modal-title-caption%}", modalTitle);
        modalHtml = modalHtml.replace("{%modal-body-id%}", modalBodyId);
        $(document.body).append(modalHtml);
        $("#" + modalId).bPopup({
            closeClass: modalCloseClass,
            onClose: modalOnCloseCallback,
            zIndex: 9999
        });
    };

    var methods = {
        /**
         * Метод получает данные с сервера и выводит их в модальном окне
         *
         * 	$( ".button").dataRefresher('showModal', {
         *		 'formHtmlUrl' : "index//getmodalhtml/",
         *	     'modalTitle' : $(this).attr('data-modal-title'),
         *	});
         */
        showModal : function() {
            updateData(
                settings['dataUrl'],
                "GET",
                {},
                function( ){
                    doCallback(settings['beforeSendCallback']);
                },
                function(data){
                    showModal(data);
                    doCallback(settings['successCallback'], data);
                },
                function(){
                    doCallback(settings['completeCallback']);
                },
            );

        },
        /**
         * Метод получает форму с сервера и выводит её в модальном окне
         * можно указать несколько dataContainerId через запятую
         *
         * 	$( this).dataRefresher('showModalForm', {
         *       'formHtmlUrl' : $(this).attr('data-form-url'),
         *       'dataContainerId' : $(this).attr('data-refresh-block-id'),
         *       'modalTitle' : $(this).attr('data-modal-title'),
         *  });
         */
        showModalForm : function() {
            updateData(
                settings['formHtmlUrl'],
                "GET",
                {},
                function( ){
                    doCallback(settings['beforeSendCallback']);
                },
                function(data){
                    showModalForm(data);
                    doCallback(settings['successCallback'], data);
                },
                function(){
                    doCallback(settings['completeCallback']);
                },
            );
        },
        /**
         * Метод перехватывает сабмит формы и делает ajax запрос с обновлением
         * можно указать несколько dataContainerId через запятую
         *
         * 	$( this).dataRefresher('refresherForm', {
         *       'formHtmlUrl' : $(this).attr('data-form-url'),
         *       'dataContainerId' : $(this).attr('data-refresh-block-id')
         *  });
         */
        refresherForm : function() {
            submitForm(this, false);
        },
        /**
         * Метод получает данные с url и заменяет ими данные в указанном блоке с dataContainerId
         * можно указать несколько dataContainerId через запятую
         *
         * $( this).dataRefresher('update', {'dataUrl':data_url, 'dataContainerId':data_container_id,
         *     'beforeSendCallback': function () {
		 *        alert("beforeSendCallback");
		  *     },
         *      'successCallback': function (data) {
		 *        alert(data);
		  *     },
         *      'completeCallback': function (data) {
         *        alert("completeCallback");
         *     },
		  *
        });
         */
        update : function() {
            updateData(
                settings['dataUrl'],
                "GET",
                {},
                function( ){
                    doCallback(settings['beforeSendCallback']);
                },
                function(data){
                    updateDomElement(data, settings['dataContainerId']);
                    doCallback(settings['successCallback'], data);
                },
                function(){
                    doCallback(settings['completeCallback']);
                },
            );
        },

        /**
         * Метод получает данные с url и дополняет ими указанный блок с dataContainerId
         *
         * $( "pager element class").dataRefresher('infinitePager', {'dataUrl':data_url, 'dataContainerId':data_container_id});
         */
        infinitePager : function() {
            var $this = this;
            updateData(
                settings['dataUrl'],
                "GET",
                {},
                function( ){
                    $this.hide();
                    $('.' + settings['loaderClass']).show();
                    doCallback(settings['beforeSendCallback']);
                },
                function(data){
                    var dataContainerId = '#' + settings['dataContainerId'];
                    var pagerClass = '.' + settings['pagerButtonClass'];
                    var loaderClass = '.' + settings['loaderClass'];
                    var html = $(data);
                    var pagerBlock = html.find(pagerClass);
                    var loaderBlock = html.find(loaderClass);
                    var listData = html.find(dataContainerId);
                    listData.find(pagerClass).remove();
                    listData.find(loaderClass).remove();
                    var inList = false;
                    if($(dataContainerId).find(pagerClass).length){
                        inList = true;
                    }
                    if (inList === true){
                        $(dataContainerId).find(pagerClass).remove();
                        $(dataContainerId).find(loaderClass).remove();
                    }
                    $(dataContainerId).append(listData.html());
                    if (inList === true){
                        $(dataContainerId).append(pagerBlock);
                        $(dataContainerId).append(loaderBlock);
                    }else{
                        $(pagerClass).replaceWith(pagerBlock);
                        $(loaderClass).replaceWith(loaderBlock);
                    }
                    doCallback(settings['successCallback'], data);
                },
                function(){
                    $this.show();
                    $('.' + settings['loaderClass']).hide();
                    doCallback(settings['completeCallback']);
                },
            );
        }
    };

    $.fn.dataRefresher = function(method, options) {
        settings = $.extend( settings, options);
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method with name ' +  method + ' not exists for jQuery.dataRefresher' );
        }
    };
})(jQuery);