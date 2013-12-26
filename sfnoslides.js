start();

function start() {		
		var condition = $('nav.fullsizedPaggedNavigation').length > 0;
		if(condition)
			loadExtension();
}

function prepareCalls(urlsArr){
	var calls = [];
	for (var i = 0; i < urlsArr.length; i++){
		(function(i) {
				console.log('calls push:' + i)
				calls.push(
					$.ajax({ url: urlsArr[i], type: 'get', dataType: 'html',  async: true 
					}).success(function(data){ console.log('success:' + i) }));
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

		var merged = splitted.join('/');
		if (merged.slice(-1) == '#')
			merged = merged.slice(0, -1);
		return merged;
	}

	pageCount = $('nav.fullsizedPaggedNavigation span').html() == null ? 0 : $('nav.fullsizedPaggedNavigation span').html().split('/')[1];
	var pagesAddresses = [];
	pagesAddresses[0] = getRootUrl();
	for (var i = 1; i < pageCount; i++) {
		pagesAddresses[i] = getRootUrl() + '/' + (i+1); 
	}
	console.log(pagesAddresses);
	return pagesAddresses;
}

deferreds = null;

function loadExtension(){
	console.log("loading");
	$('nav.fullsizedPaggedNavigation').append('<div><a id="loadAllButton" href="#">Ładuj</a></div>');
	$('#loadAllButton').click(function(){
		deferreds = prepareCalls(getPagesUrls());
        $.when.apply(null, deferreds).done(function() {
        	console.log('----done-----');
        	var full = $('<div></div>');
        	for (var i = 0; i < deferreds.length; i++){
        		console.log('processing ' + i);        		
        		full.append(processContent(i, $.parseHTML(deferreds[i].responseText)));
        		console.log('response length:' + deferreds[i].responseText.length);
        	}
        	$('.box-article').html("");
        	$('.box-article').append(full);
        });
	});
}

function processContent(order, contentDoc){
	var content = $("<div></div>");
	if(order == 0){
		content.append($(contentDoc).find('footer.article-footer')[0]);
		content.append($(contentDoc).find('header.article-header')[0]);		
		content.append($('<div style="margin-top: 50px;"></div>').append($(contentDoc).find('div.article-lead')[0]));
	}
	var art = $(contentDoc).find('article.box-article');
	art.find('footer.article-footer, header.article-header, div.article-lead, nav.fullsizedPaggedNavigation, form.contentpoll').remove();
	content.append(art);
	//$(document).find('article.box-article').find('footer.article-footer, header.article-header, div.article-lead, nav.fullsizedPaggedNavigation, form.contentpoll').remove()
	return content;
}