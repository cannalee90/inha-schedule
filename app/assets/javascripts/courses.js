var colors = new Array("#89C4F4","#BE90D4","#E08283","#F5D76E", "#D2D7D3", "#C8F7C5", "#E4F1FE", "#C5EFF7", "#A2DED0","#DCC6E0", "#F1A9A0","#FDE3A7", "#ECEECE");
var timetable = new Object();
var colorHash = new Object();
var codeHash = new Object();
var total_credit = 0;

function getIdx(day, time) {
	return (parseInt(day) * 30) + parseInt(time);
}

function getColorIdx() {
	while(true){
		var ranNum = parseInt(Math.random() * 100) % colors.length;
		if(colorHash[ranNum] != 1) {
			colorHash[ranNum] = 1;
			return ranNum;
		}
	}
}
function isOverlapped(col, row) {
	var idx = getIdx(col, row);
	for(var i in timetable) {
		if(idx == i)
			return true;
	}
	return false;
}
function isDay(days) {
	if(days == "월")
		return 0;
	else if(days == "화")
		return 1;
	else if(days == "수")
		return 2;
	else if(days == "목")
		return 3;
	else if(days == "금")
		return 4;
	else 
		return -1;
}

function window_size() {
	if($(window).width() < 768) {
		$('div.addedcell > div.outer > div.inner > span').addClass('small-name');
		$('#timetable> tbody > tr > td').addClass('small-name');
	}else {
		$('div.addedcell > div.outer > div.inner > span').removeClass('small-name');
		$('#timetable> tbody > tr > td').removeClass('small-name');
	}
}

function filling(selected, status) {
	function parser(time) {
		var ret = {};
		var classes = new Array(0,0,0,0,0);
		var begins = new Array(-1, -1, -1, -1, -1);
		var numbers = new Array();
		var location = "";
		var classes_loca = new Array("", "", "", "", "");
		var cnt = 0;
		var idx = -1;
		var num = "";
		var flag = -1;
		var loca_flag = false;
		var reserved = "";
		var overlapped = false;
	if(status == 1) {
		if(codeHash.length > colors.length) {
			alert("수업을 더이상 추가할 수 없습니다");
			return false;
		}
	}		for(var i = 0; i < time.length; i++) {
			var tmp = isDay(time[i]);
			var cur = time[i];
			if(tmp != -1){
				idx = tmp;
				num = "";
				flag = 1;
			}
			if((cur == ',' || cur ==  '(')){
				overlapped = (overlapped == false) ? isOverlapped(idx, parseInt(num)) : true;
				if(overlapped == true && status == 1) {
					alert("시간표가 겹칩니다");
					return false;
				}
				if(flag == 1) {
					begins[idx] = parseInt(num) - 1;
					cnt++;
				}
				numbers.push(getIdx(idx, num));
				classes[idx] ++;
				flag = 0;
				num = "";
			}
			else if(cur >= '0' && cur <= '9'){
				num = num +  cur;
			}
			if(loca_flag == true && cur != ")") {
				location = location + cur;
			}
			else if(cur == ")"){
				loca_flag = false;
				classes_loca[idx] = "(" + location + ")";
				reserved = "(" + location + ")";
				location = "";
			}
			if(cur == "(") {
				loca_flag = true;
			}
		}
		for(var i = 0; i <5; i++)  {
			if(begins[i] != -1 && classes_loca[i] == "") {
				classes_loca[i] =reserved;
			}
		}
		ret['classes'] = classes;
		ret['begins'] = begins;
		ret['numbers'] = numbers;
		ret['overlapped'] = overlapped;
		ret['classes_loca'] = classes_loca;
		return ret;
	}
	
	var time = selected['time'];
	var parsed_data = parser(time);
	var code = selected['code'];
	var instructor = selected['instructor'];
	var classes = parsed_data['classes'];
	var begins = parsed_data['begins'];
	var numbers = parsed_data['numbers'];
	var overlapped = parsed_data['overlapped'];	
	var className = selected['className'];
	var classes_loca = parsed_data['classes_loca'];
	var firstHeight = $('#timetable > thead > tr > th').outerHeight();
	var height = $('#timetable > tbody > tr > td').outerHeight() / 2;
	var leftMargin = $('#timetable > tbody > tr > td').outerWidth();
	if(status == 1) {
		var colorIdx = getColorIdx();
		codeHash[code] = 1;
	}
	for(var i = 0; i < 5; i++) {
		var timeCellWidth = $('#timetable > thead > tr > th').eq(i + 1).outerWidth();
		if(begins[i] != -1){
			$('div#alltimecellcontainer').prepend('<div class = "timecellcontainer">');
			$('div.timecellcontainer:first').append('<div class ="addedcell" ></div>');
			var cur = $('div.timecellcontainer:first > div.addedcell');
			$(cur).attr('class-time', numbers);
			$(cur).attr('class-code', code);
			$(cur).attr('class-day', i);
			$(cur).attr('class-credit', selected['classCredit']);
			$(cur).css({'top' : (begins[i] * height) + firstHeight, 'left' : leftMargin, 'width' : timeCellWidth, 'height' : height * classes[i], background : colors[colorIdx]});
			if(status == 1){
				$(cur).attr('class-color', colorIdx);
			}
			else{
				$(cur).attr('status', 'tmp');
				$(cur).css({'background' : 'grey', 'opacity' : 0.8, 'z-index' : 200});
			}
			$(cur).append('<div class = "outer"></div>');
			$(cur).find('.outer').append('<div class = "inner"></div>');
			cur = $(cur).find('.inner');
			$(cur).append('<span><strong>' + className + '</strong></span>' + '<br>');
			$(cur).append('<span class = "hidden-xs"><em>' + instructor + '</em></span>');
			$(cur).append('<span><em>' + classes_loca[i] + '</em></span>');
			if(overlapped == true) {
				$(cur).text("");
				$(cur).append('<span class = "font-white">' + "겹침ㅠ_ㅠ" + '</span>')
			}
			if(status == 1) {
				for(var j = 1; j <= classes[i]; j++) {
					timetable[getIdx(i, parseInt(begins[i]) + j)] = 1;
				}
			}
		}
		leftMargin += timeCellWidth;
	}
	if(status == 1){
		total_credit = parseInt(selected["classCredit"]) + total_credit;
		$('#total_credit').text(total_credit);
	}
	window_size();
	return true;
}

$(window).resize(function() {
	var timeCellWidth = $('#timetable > thead > tr > th').eq(2).outerWidth();
	$('div.addedcell').css({"width" : timeCellWidth});
	var table_data = $('#timetable > thead > tr > th');
	var partial = new Array(6);
	partial[0] = $(table_data).eq(0).outerWidth();
	for(var i = 1; i < table_data.length; i++) {
		partial[i] = partial[i - 1] + $(table_data).eq(i).outerWidth();
	}
	for(var i = 0; i < 5; i++) {
		$('div.addedcell[class-day=' + i + ']').css({"left" : partial[i]});	
	}
	window_size();
});

$(document).on('click', 'div.addedcell' , function() {
	var timeArray = $(this).attr('class-time').split(',');
	if($(this).attr('status') != "tmp") {			
		total_credit = total_credit - parseInt($(this).attr('class-credit'));
		$('#total_credit').text(total_credit); 	
	}	
	for(var i in timeArray) {
		cur = timeArray[i];
		delete timetable[cur];
	}
	var selectors = $(this).attr('class-code');
	delete codeHash[selectors];
	delete colorHash[$(this).attr('class-color')];
	$('div.addedcell[class-code=' + selectors + ']').parent().remove();
	localStorage.removeItem(selectors);
});


$(document).on('click', '#search_result > tbody> tr', function() {
	$('span#added').remove();
	var cell = $('div.addedcell');
		for(var i = 0; i < $(cell).length; i++) {
			if($(cell).eq(i).attr('status') == "tmp") {
				$(cell).eq(i).parent().remove();	
		}
	}
	$(this).children().eq(1).append('<span class = "label rounded-2x label-success" id = "added">추가</span>')
	$(this).children(':last-child').append('<span class = "label rounded-2x label-success" id = "added">추가</span>')
		var selected = {
		code : $(this).data('code'),
		time : $(this).data('link'),
		className : $(this).children(':nth-child(2)').children(':nth-child(1)').text(),
		instructor : $(this).children(':nth-child(7)').text(),
		classCredit : $(this).children(':nth-child(4)').text()
	}
	filling(selected, 0);
})

$(document).on('click', 'span#added', function(e) {
	e.stopPropagation();
	var selected = {
		code : $(this).parent().parent().data('code'),
		time : $(this).parent().parent().data('link'),
		instructor : $(this).parent().parent().children(':nth-child(7)').text(),
		className : $(this).parent().parent().children(':nth-child(2)').children(':nth-child(1)').text(),
		classCredit : $(this).parent().parent().children(':nth-child(4)').text()
	}
	if(filling(selected, 1)) {
		localStorage.setItem(selected['code'], JSON.stringify(selected));
	} 
	var cell = $('div.addedcell');
	for(var i = 0; i < $(cell).length; i++) {
		if($(cell).eq(i).attr('status') == "tmp") {
			$(cell).eq(i).parent().remove();	
		}
	}
})

$(document).ready(function() {
	for(var key in window.localStorage){
		var selected = JSON.parse(localStorage.getItem(key));
  	filling(selected, 1);
	}
});

