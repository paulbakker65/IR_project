////////////
// PARAMS //
////////////


// DATA
// Opbouw JSONs: [[titles][links][snippets][cluster]]

var jaguar = {
	name:"Jaguar",
	task:"Find a retailer for...",
	datalink:"./jaguar.json"
};

var shell = {
	name:"Shell",
	task:"What type of...",
	datalink:"./shell.json"
};

var hertz = {
	name:"Hertz",
	task:"Where is...",
	datalink:"./hertz.json"
};

var subjectlist = {Jaguar:jaguar, Shell:shell, Hertz:hertz};


// CONFIG

var n_items_pp = 20;

var categorised = true;

var currentsubject = jaguar;

var currentpage = 1;

var n_pages = 0;

var mode = true; // true == categorised



///////////
// NAVs ///
///////////



function subject_navigation(subject){
	// create subject navigation
	subj_items = [];
	for (var key in subjectlist) {
		subj_items.push("<span class='subj_nav' id='"+subjectlist[key].name+"'>"+subjectlist[key].name+"</span>");
	};
	$("<div/>", {
		"class": "subject",
		html: subj_items.join("")
	}).appendTo("nav");
	// highlight current subject
	$("#"+subject.name).attr('id', 'currentpage');
};

function page_navigation(n_pages, page){
	var p_navs = [];
	p_navs.push("<span class='pagenav' id='first'><< first</span>");
	p_navs.push("<span class='pagenav' id='prev'>< previous</span>");
	var pagebegin = 0;
	pagebegin = page - 5;
	if (pagebegin < 1){
		pagebegin = 1;
	};
	for (j = pagebegin; j < page; j++) {
		p_navs.push("<span class='pagenav' id='"+j+"'>"+j+"</span>");
	};
	p_navs.push("<span class='pagenav' id='currentpage'>"+page+"</span>");
	var page_end = 0;
	page_end = page+5;
	if (page_end > n_pages) {
		page_end = n_pages;
	};
	if (page == n_pages) {
		$( "<div/>", {
			"class": "pnavbar",
			html: p_navs.join("")
		}).appendTo( "article" );
		return	
	};
	for (k = (page+1); k < page_end; k++) {
		p_navs.push("<span class='pagenav' id='"+k+"'>"+k+"</span>");
	};
	p_navs.push("<span class='pagenav' id='next'>next ></span>");
	p_navs.push("<span class='pagenav' id='last'>last >></span>");
	$( "<div/>", {
		"class": "pnavbar",
		html: p_navs.join("")
	}).appendTo("article");
};



/////////////////////
////UNCATEGORISED////
/////////////////////



function get_data_uncategorised(page, subject) {
	// clear previously loaded items
	$("article").empty();
	$("nav").empty();
	subject_navigation(subject);
	// populate with entries
	$.getJSON(subject.datalink, function(data) {
		var list_of_items = [];
		var pagemax = (page*n_items_pp)
		if (pagemax > data[0].length) {
			pagemax = data[0].length;
		};
		for (i = ((page-1)*n_items_pp); i < pagemax; i++) {
			var items = [];
			items.push("<div class='entry' href='"+ data[1][i] + "'>");
			items.push("<div class='" + data[3][i] + " id='" + i + "'>");
			items.push("<div class='title'>" + data[0][i] + "</div>");
			// items.push("<div class='link'>" + data[1][i] + "</div>");
			items.push("<div class='snippet'>" + data[2][i] + "</div>");
			items.push("</div></div>");
			list_of_items.push(items.join(""));
		};
		$( "<div/>", {
			"class": "my-new-list",
			html: list_of_items.join("")
		}).appendTo( "article" );
		// page navigation
		n_pages = Math.ceil(data[0].length/n_items_pp);
		page_navigation(n_pages, page);
	});
};




///////////////////
////CATEGORISED////
///////////////////



var categorised_data = {};

function prep_data_categorised(subject){
	// populate with entries
	// split in cat
	categorised_data = {}; // clear previous data
	$.getJSON(subject.datalink, function(data) {
		for (i = 0; i < data[0].length; i++) {
			var entry = {
				title: data[0][i],
				link: data[1][i],
				snippet: data[2][i],
				idx: i,
			};
			if (typeof categorised_data[data[3][i]] == "undefined"){
				start_list = [];
				start_list.push(entry);
				categorised_data[data[3][i]] = start_list;
			} else {
				categorised_data[data[3][i]].push(entry);
			};
		};
	});
};

function load_data_categorised(page, subject, catdata){
	// catdata = object = { subject1 : [entry_object_1, entry_object_2, ...], subject2 : [ ... , ... , ...]}
	$("article").empty();
	$("nav").empty();
	subject_navigation(subject);
	// var cat_e_pp = Math.floor(n_items_pp/catdata.length);
	var cat_e_pp = 4;
	var cat_cont = [];
	n_pages = 1000;
	var max_i = 0;
	for (var key in catdata) {
		var k_pages = Math.ceil(catdata[key].length/cat_e_pp);
		if (n_pages > k_pages) {
			n_pages = k_pages;
			max_i = (catdata[key].length)-1;
		};
	};
	console.log(catdata)
	console.log(n_pages);
	for (var key in catdata) {
		cat_cont.push("<div class='category'>");
		var list_of_items = [];
		var begin_i = (page-1)*cat_e_pp;
		var end_i = (page*cat_e_pp);
		if (end_i > max_i) { end_i = max_i;};
		for (i = begin_i; i < end_i; i++) {
			var items = [];
			// console.log(i);
			// console.log(catdata[key][i].title);
			items.push("<div class='entry' id='" + catdata[key][i].idx + "' href='"+ catdata[key][i].link +"'>");
			items.push("<div class='title'>" + catdata[key][i].title + "</div>");
			// items.push("<div class='link'>" + catdata[key][i].link + "</div>");
			items.push("<div class='snippet'>" + catdata[key][i].snippet + "</div>");
			items.push("</div>");
			list_of_items.push(items.join(""));			
		};
		cat_cont.push(list_of_items.join(""));
		cat_cont.push("</div>");
	};
	$( "<div/>", {
		"class": "cat-new-list",
		html: cat_cont.join("")
	}).appendTo( "article" );
	page_navigation(n_pages, page);
};



//////////
// MAIN //
//////////



function get_data(mode, subject, page) {
	if (mode == true) {
		load_data_categorised(page, subject, categorised_data);
	} else {
		get_data_uncategorised(page, subject);
	};
};

function switch_data(mode, subject) {
	prep_data_categorised(subject);
	currentpage = 1;
	setTimeout(function(){get_data(mode, subject, currentpage);}, 3000);
}

switch_data(mode, currentsubject);



////////////
// EVENTS //
////////////

$(document).on('click', '.subj_nav', function(e){
	// console.log(e)
	// console.log($(this))
	if ($(this)["0"].id == 'currentpage') {
		return
	};
	currentsubject = subjectlist[$(this)["0"].id]
	switch_data(mode, currentsubject);
});

$(document).on('click', '.entry', function(e){
	window.open($(this)["0"].attributes.href.value)
});

$(document).on('click', '.pagenav', function(e){
	// console.log(e)
	// console.log($(this))
	if ($(this)["0"].id == 'currentpage') {
		return
	};
	if ($(this)["0"].id == 'first') {
		if (currentpage == 1){
			return
		};
		currentpage = 1;
	};
	if ($(this)["0"].id == 'prev') {
		if (currentpage == 1){
			return
		};
		currentpage -= 1;
	};
	if ($(this)["0"].id == 'next') {
		if (currentpage > (n_pages-1)){
			return
		};
		currentpage +=1;
	};
	if ($(this)["0"].id == 'last') {
		if (currentpage == n_pages){
			return
		};
		currentpage = n_pages;
	};
	if ($(this)["0"].id.length < 3) {
		currentpage = Number($(this)["0"].id);
	};	
	get_data(mode, currentsubject, currentpage);
});

