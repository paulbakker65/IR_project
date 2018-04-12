////////////
// PARAMS //
////////////


// DATA
// Opbouw JSONs: [[titles][links][snippets][cluster]]

var jaguar = {
	name:"Jaguar",
	task:"Find some games highly regarded to play on the Atari Jaguar game console.",
	datalink:"./jaguar.json",
	num:0
};

var shell = {
	name:"Shell",
	task:"What do we mean when we say 'on shell particles'?",
	datalink:"./shell.json",
	num:1
};

var hertz = {
	name:"Hertz",
	task:"What is the gas mileage of a class A car that can be rented at Hertz?",
	datalink:"./hertz.json",
	num:2
};

var apple = {
		name:"Apple",
		task:"How much does the game 'Apples to Apples' cost?",
		datalink:"./apple.json",
		num:3
	};

var fish = {
		name:"Fish",
		task:"You are looking for a paper on the detection of eyeshine by flashlight fishes.",
		datalink:"./fish.json",
		num:4
	};

var mouse = {
		name:"Mouse",
		task:"You are looking for an elementary school report on Mickey Mouse.",
		datalink:"./mouse.json",
		num:5
	};

var bear = {
		name:"Bear",
		task:"Find the lyrics of the song 'Cherish' by Papa Bear.",
		datalink:"./bear.json",
		num:6
	};

var duck = {
		name:"Duck",
		task:"Who does the voice of Daffy Duck in 'To Duck... or Not to Duck'?",
		datalink:"./duck.json",
		num:7
	};

var subjectlist = {Jaguar:jaguar, Shell:shell, Hertz:hertz, Apple:apple, Fish:fish, Mouse:mouse, Bear:bear, Duck:duck};


// CONFIG

var n_items_pp = 20;

var currentsubject = jaguar;

var currentpage = 1;

var n_pages = 0;

var lclicks = 0;

var pclicks = 0;

var begin = Date.now()

var mode_array = [true,true,true,true,false,false,false,false]

var not_saved = true;

var log_saved = false;

var log = [ 
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0},
		{task:"", cat:false, found:false, time:0, lclicks:0, pclicks:0}
		];

var uid = Math.floor((Math.random() * 99999) + 1);
var user = {age: "0", gender: "NA", uid: uid};

///////////
// NAVs ///
///////////

function subject_navigation(subject){
	// create subject navigation
	$("nav").append("<p>Instruction: Go through all 8 topics hereunder and execute the search challenge. If you found the answer, click the button on the top right. If you can't find it, you can give up. After completing all challenges, please save the results.</p>");
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
	$("nav").append("<p>Your challenge: "+subject.task+"</p>");
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
	//console.log(catdata)
	//console.log(n_pages);
	var cn = 0;
	for (var key in catdata) {
		cat_cont.push("<div class='category' id='C"+cn+"'>");
		cn++;
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

function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

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

function log_time() {
	if(mode_array[currentsubject["num"]]) {
		console.time(currentsubject["name"].concat(" categorized"))
	}
	else {
		console.time(currentsubject["name"].concat(" uncategorized"))
	};
};

function log_timeEnd() {
	if(mode_array[currentsubject["num"]]) {
		console.timeEnd(currentsubject["name"].concat(" categorized"));
	}
	else {
		console.timeEnd(currentsubject["name"].concat(" uncategorized"));
	};
	console.log("Number of clicks: " + lclicks)
	
	
};

function found_it() {
	not_saved = false;
	console.log("Found");
	log_timeEnd();
	
	var end = Date.now();
	
	log[currentsubject["num"]].task = currentsubject.name;
	log[currentsubject["num"]].cat = mode_array[currentsubject["num"]];
	log[currentsubject["num"]].found = true;
	log[currentsubject["num"]].time = (end-begin)/1000;
	log[currentsubject["num"]].pclicks = pclicks;
	log[currentsubject["num"]].lclicks = lclicks;
	
	pclicks = 0;
	lclicks = 0;
}

function give_up() {
	not_saved = false;
	console.log("Gave up");
	if(mode_array[currentsubject["num"]]) {
		console.log(currentsubject["name"].concat(" categorized"))
	}
	else {
		console.log(currentsubject["name"].concat(" uncategorized"))
	};
	
	log[currentsubject["num"]].task = currentsubject.name;
	log[currentsubject["num"]].cat = mode_array[currentsubject["num"]];
	log[currentsubject["num"]].found = false;
	log[currentsubject["num"]].time = -1;
	log[currentsubject["num"]].pclicks = pclicks;
	log[currentsubject["num"]].lclicks = lclicks;

	pclicks = 0;
	lclicks = 0;
};

var feedbackform = "\
<p>Please provide us with a little additional feedback:</p>\
<br><br>\
<b>I can find an answer more efficiently by using categorized search results.</b>\
<br>\
<b>I fully agree = 7 ; I fully disagree = 1</b>\
<select name='FB1' id='FB1'></select>\
<br><br>\
<b>I prefer browsing through a uncategorized list of search results.</b>\
<br>\
<b>I fully agree = 7 ; I fully disagree = 1</b>\
<select name='FB2' id='FB2'></select>\
<br><br>\
<b>I don't like browsing through a list of uncategorized search results.</b>\
<br>\
<b>I fully agree = 7 ; I fully disagree = 1</b>\
<select name='FB3' id='FB3'></select>\
";

var lickert = "\
<option value='NaN'>please select</option>\
<option value='1'>1</option>\
<option value='2'>2</option>\
<option value='3'>3</option>\
<option value='4'>4</option>\
<option value='5'>5</option>\
<option value='6'>6</option>\
<option value='7'>7</option>\
"

function save() {
	log_saved = true;
	var usrstr = JSON.stringify(user);
	var data = {};
	$( "<div id='feedback'></div>").appendTo( "body" );
	$(feedbackform).appendTo("#feedback");
	$(lickert).appendTo(["#FB1", "#FB2", "#FB3"]);
	$( function() {
		$("#feedback").dialog({
			dialogClass: "no-close",
			title: "Almost done!",
			buttons: [
			{
				text: "Submit and Save results",
				click: function() {
					var feedback = {};
					feedback.fb1 = $("#FB1")["0"].value;
					feedback.fb2 = $("#FB2")["0"].value;
					feedback.fb3 = $("#FB3")["0"].value;
					data[usrstr]=[log, feedback];
					$.post("saveresults.php", {json : JSON.stringify(data)}, function(e){alert(e);});
					$(this).dialog("close");
				}
			}]
		});
	});
};

function basic_info() {
	$( "<div id='basicinfo'></div>").appendTo( "body" );
	$("<p>Please insert your age and gender</p>").appendTo("#basicinfo");
	$( "<form id='userinfo' action='javascript:;' onsubmit='myFunction(this)'></form>").appendTo("#basicinfo");
	$("#userinfo").append("\
		<input type='text' placeholder='Age' name='age' id='age'/>\
		<br><br>\
		<select name='gender' id='gender'>\
		<option value='NP'>Gender: please select</option>\
		<option value='male'>Male</option>\
		<option value='female'>Female</option>\
		<option value='other'>Other</option>\
		</select>");
	$( function() {
		$("#basicinfo").dialog({
			dialogClass: "no-close",
			title: "Welcome!",
			buttons: [
			{
				text: "Submit",
				click: function() {
					user.age = $("#age")["0"].value;
					user.gender = $("#gender")["0"].value;
					$(this).dialog("close");
					console.log(user);
				}
			}]
		}
			);
	});
};



mode_array = shuffle(mode_array);
switch_data(mode_array[currentsubject["num"]], currentsubject);
basic_info();
begin = Date.now();
log_time();


////////////
// EVENTS //
////////////

$(window).on("beforeunload", function() { 
	if(!log_saved) {
    	return confirm("Did you save after completing all the search tasks? If not please do"); 
	}
	else {
		return
	}
});

$(document).on('mouseenter', '.subj_nav', function(){
	$(this).addClass("hover");
});

$(document).on('mouseleave', '.subj_nav', function(){
	$(this).removeClass("hover");
});

$(document).on('mouseenter', '.entry', function(){
	$(this).addClass("hover");
});

$(document).on('mouseleave', '.entry', function(){
	$(this).removeClass("hover");
});

$(document).on('click', '.subj_nav', function(e){
	// console.log(e)
	// console.log($(this))
	if(not_saved) {
		alert("Please provide if you have found the information or given up on this particular task");
		return
	}
	
	if ($(this)["0"].id == 'currentpage') {
		begin = Date.now();
		log_time();
		return
	};
	currentsubject = subjectlist[$(this)["0"].id];
	begin = Date.now()
	log_time();
	switch_data(mode_array[currentsubject["num"]], currentsubject);
	not_saved = true;
});

$(document).on('click', '.entry', function(e){
	lclicks++; 
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
	pclicks++;
	get_data(mode_array[currentsubject["num"]], currentsubject, currentpage);
});

