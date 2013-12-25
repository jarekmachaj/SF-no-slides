//window.onload = function() { start(); }

function start() {		
		var condition = $('nav.fullsizedPaggedNavigation').length > 0;
		if(condition)
			loadExtension();
}

function prepareCalls(urlsArr){
	var calls = [];
	for (var i = 0; i < urlsArr.length; i++){
		(function(i) {
				calls.push(
					$.ajax({ url: urlsArr[i], type: 'get', dataType: 'html',  async: true 
					}).success(function(data){ console.log('success') }));
  		})(i);		
	}
	return calls;
}

function getPagesUrls(){

	function getRootUrl(){
		//chenge to regex that deletes last int!
		var currUrl = document.URL;
		var splitted = currUrl.split('/');
		if (splitted.length > 6)
			splitted.pop();

		return splitted.join('/');
	}

	pageCount = $('nav.fullsizedPaggedNavigation span').html() == null ? 0 : $('nav.fullsizedPaggedNavigation span').html().split('/')[1];
	var pagesAddresses = [];
	pagesAddresses[0] = getRootUrl();
	for (var i = 1; i < pageCount; i++) {
		pagesAddresses[i] = getRootUrl() + '/' + (i+1); 
	}
	return pagesAddresses;
}

deferreds = null;

function loadExtension(){
	console.log("loading");
	$('nav.fullsizedPaggedNavigation').append('<div><a id="loadAllButton" href="#">Ładuj</a></div>');
		var responses = [];
		deferreds = prepareCalls(getPagesUrls());
		$('.box-article').html("");
        $.when.apply(null, deferreds).done(function() {
        	console.log('----done-----');
        	for (var i = 0; i < deferreds.length; i++){
        		console.log('processing ' + i);
        		$('.box-article').append(processContent(i, $.parseHTML(deferreds[i].responseText)));
        	}
        });
}


function processContent(order, contentDoc){
	var content = $("<div></div>");
	if(order == 0){
		content.append($(contentDoc).find('footer.article-footer')[0]);
		content.append($(contentDoc).find('header.article-header')[0]);		
		content.append($('<div style="margin-top: 50px;"></div>').append($(contentDoc).find('div.article-lead')[0]));
	}
	return content;
}