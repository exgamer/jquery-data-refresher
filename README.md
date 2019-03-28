# jquery-data-refresher


  Плагин для обновления HTML контента
 
  требует jquery и плагин bPopup
 
 
  Пример вызова для обновления HTMl элемента
  можно указать несколько dataContainerId через запятую
 
  $( ".button").dataRefresher('update', {'dataUrl': '/index', 'dataContainerId': 'blockToRefresh'});
 


/**
 * Пример реализации бесконечного списка
 */
 
 <div  id="infinite-list">     
    <a class="js-infinite" data-container-id="infinite-list" data-url="/url">
      Загрузить еще
    </a>
    <div class="js-loader" style="display:none">загрузка</div>       
 </div>
 
 
$(document).on('click','.js-infinite',function(e){
	e.preventDefault();
	var data_container_id = $(this).attr('data-container-id');
	var data_url = $(this).attr('data-url');
	$( this).dataRefresher('infinitePager', {'dataUrl':data_url, 'dataContainerId':data_container_id});
});

/**
 * Для вывода модалки с формой
 */
 
$(document).on('click', '.ghost-modal-control', function(e){
	e.preventDefault();
	$( this).dataRefresher('showModalForm', {
		 'formHtmlUrl' : $(this).attr('data-form-url'),
		 'dataUrl' : $(this).attr('data-refresh-block-url'),
		 'dataContainerId' : $(this).attr('data-refresh-block-id'),
	     'modalTitle' : $(this).attr('data-modal-title'),
		 'formSuccessCallback': function (data) {
              ....
		 },
		 'formCompleteCallback': function () {
			........
		 },
		'completeCallback': function () {
			...........
		}
	});
});


/**
 * Для ajax сабмита форм
 */
 
$(document).off('submit', '.refresher-form');
$(document).on('submit', '.refresher-form', function(event) {
	event.preventDefault();
	$( this).dataRefresher('refresherForm', {
		'formHtmlUrl' : $(this).attr('data-form-url'),
		'dataUrl' : $(this).attr('data-refresh-block-url'),
		'dataContainerId' : $(this).attr('data-refresh-block-id'),
		'modalTitle' : $(this).attr('data-modal-title'),
		'formSuccessCallback': function (data) {
            ...
		},
		'formCompleteCallback': function () {
			..............
		},
		'completeCallback': function () {
			..............
		}
	});
});