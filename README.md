# jquery-data-refresher Плагин для обновления HTML контента

## требует jquery и плагин bPopup
 
 
  ### Пример вызова для обновления HTMl элемента
  #### можно указать несколько dataContainerId через запятую
```
  $( ".button").dataRefresher('update', {'dataUrl': '/index', 'dataContainerId': 'blockToRefresh'});
 ```



### Пример реализации бесконечного списка

 #### HTML
 ```
 <div  id="infinite-list">     
    <a class="js-infinite" data-container-id="infinite-list" data-url="/url">
      Загрузить еще
    </a>
    <div class="js-loader" style="display:none">загрузка</div>       
 </div>
 ```
 #### JS
 
 ```
$(document).on('click','.js-infinite',function(e){
	e.preventDefault();
	var data_container_id = $(this).attr('data-container-id');
	var data_url = $(this).attr('data-url');
	$( this).dataRefresher('infinitePager', {'dataUrl':data_url, 'dataContainerId':data_container_id});
});

```


### Для вывода модульного окна с формой и обнвления контента указанного блока

 #### HTML
 ```
     <div  id="container">
             <a class="ghost-modal-control" data-refresh-block-id="container"
                data-modal-title="my modal"
                data-form-url="/form/url"
                data-refresh-block-url="/refresh/block/url">показать форму в модальном окне</a>
    </div>
  ```
 #### JS
 ```
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
```


### Для ajax сабмита форм

 #### HTML
    <form  class="refresher-form" method="POST" action="/" enctype="multipart/form-data">
            .....
            <button class="btn btn-send-request" type="submit">отправить</button>

    </form>
					
 #### JS
 ```
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
```