# jquery-data-refresher


  Плагин для обновления HTML контента
 
  требует jquery и плагин bPopup
 
 
  Пример вызова для обновления HTMl элемента
  можно указать несколько dataContainerId через запятую
 
  $( ".button").dataRefresher('update', {'dataUrl': '/index', 'dataContainerId': 'blockToRefresh'});
 
 
  Пример вызова для реализации бесконечного списка
 
  $( ".button").dataRefresher('infinitePager', {'dataUrl': '/index', 'dataContainerId': 'list'});
 
 
  Пример показа модального окна с подгрузкой контента
 
  	$( ".button").dataRefresher('showModal', {
 		 'formHtmlUrl' : "index//getmodalhtml/",
 	     'modalTitle' : $(this).attr('data-modal-title'),
 	});
 
 Пример показа модального окна с формой
  можно указать несколько dataContainerId через запятую
 
  $( ".button").dataRefresher('showModalForm', {
 	 'formHtmlUrl' : 'get/form/html',
 	 'dataUrl' : 'get/refresh/block/data/html',
  	 'dataContainerId' : 'refresh-block-id',
    'modalTitle' : 'modal form',
  });
 
 
    Пример сабмита формы через ajax
 
     $( this).dataRefresher('refresherForm', {
            'formHtmlUrl' : $(this).attr('data-form-url'),
            'dataUrl' : $(this).attr('data-refresh-block-url'),
            'dataContainerId' : $(this).attr('data-refresh-block-id'),
            'modalTitle' : $(this).attr('data-modal-title'),
            'formSuccessCallback': function (data) {
                if(data.data !== undefined && data.data.redirectUrl !== undefined) {
                    location.href = data.data.redirectUrl;
                }
            },
            'formCompleteCallback': function () {
                $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').each(function () {
                    if ($(this).val() || $(this).text()) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                   }
                });
              $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').off('blur');
                $('.animated-field input, .animated-field textarea, .animated-field select, .animated-field [contenteditable]').on('blur', function () {
                    if ($(this).val() || $(this).text()) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            },
            'completeCallback': function () {
                if(typeof donutValues !== 'undefined'){
                    intel.complaint.processDonutValues(donutValues)
                }
            }
        });
