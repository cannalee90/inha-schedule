var colors = new Array("#EAA678","#8585D6","#63C2A2","#89C4F4","#BE90D4","#E08283","#F5D76E", "#D2D7D3", "#C8F7C5", "#E4F1FE", "#C5EFF7", "#A2DED0","#DCC6E0", "#F1A9A0","#FDE3A7", "#ECEECE");
var timetable = new Object();
var colorHash = new Object();
var codeHash = new Object();
var total_credit = 0;

function getIdx(day, time) {
	return (parseInt(day) * 30) + parseInt(time);
}

function clear() {
	timetable = new Object();
	colorsHash = new Object();
	codeHash = new Object();
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

function isOver(dayofweek, numbers) {
	var idx = getIdx(dayofweek, numbers);
	if(timetable[idx] == 1) {
		return true;
	}
	else
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
	else if(days == "토")
		return 5;
	else if(days == "셀")
		return 6;
	else
		return -1;
}

function window_size() {
	if($(window).width() < 768) {
		$('div.addedcell > div.outer > div.inner').addClass('small-name');
		$('#timetable> tbody > tr > td').addClass('small-name');
	}else {
		$('div.addedcell > div.outer > div.inner').removeClass('small-name');
		$('#timetable> tbody > tr > td').removeClass('small-name');
	}
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function test(selected, status){
	function modified(time) {
		var numbers = new Array();
		var location = "";
		var idx = -1;
		var num = "";
		var didx = -1;
		var flag = -1;
		var loca_flag = false;
		var reserved = "";
		var data = new Array();
		var daykind = time.match(/(월|화|수|목|금|토|셀)/g);
		for(var i = 0; i < daykind.length; i++) {
			data[i] = new Array();
			data[i]['days'] = daykind[i];
		}
		time = time + '$'
		for(var i = 0; i < time.length; i++) {
			var tmp = isDay(time[i]);
			var cur = time[i];
			if(tmp != -1 || cur == '$'){
				if(cur == '$' && isNumber(time[i-1])) {
					numbers.push(num);
				}
				if(numbers.length != 0){
					data[didx]['numbers'] = numbers;
				}
				idx = tmp;
				num = "";
				flag = 1;
				didx ++;
				numbers = [];
			}
			if((cur == ',' || cur ==  '(')){
				numbers.push(num);
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
				data[didx]['classes_loca'] = "(" + location + ")";
				reserved = "(" + location + ")";
				location = "";
			}
			if(cur == "(") {
				loca_flag = true;
			}
		}
		for(var i = 0; i < didx; i++)  {
			if(data[i]['classes_loca'] == null) {
				data[i]['classes_loca'] = reserved;
			}
		}
		return data;
	}
	var time = selected['time'];
	var instructor = selected['instructor'];
	var className = selected['className'];
	var code = selected['code'];
	var data = modified(time);
	var overlapped = false;
	var isAdded = false;
	window_size();
	var firstHeight = $('#timetable > thead > tr > th').outerHeight();
	var height = $('#timetable > tbody > tr > td').outerHeight() / 2;
	var leftMargin = $('#timetable > tbody > tr > td').outerWidth();

	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < data[i]['numbers'].length; j++){
			var dayofweek = isDay(data[i]['days']);
			if(isOver(dayofweek, data[i]['numbers'][j])) {
				overlapped = true;
				break;
			}
		}
	}
	/*조건 끝*/
	if(status == 1) {
		var colorIdx = getColorIdx();
		codeHash[code.split('-')[0]] = 1;
	}
	for(var i = 0; i < data.length; i++) {
		if(data[i]['classes_loca'] == "(웹강의)") {
			continue;
		}
		var dayofweek = isDay(data[i]['days']);
		var timeCellWidth = $('#timetable > thead > tr > th').eq(dayofweek + 1).outerWidth();
		var partial = getPartial($('#timetable > thead > tr > th'));
		$('div#alltimecellcontainer').prepend('<div class = "timecellcontainer">');
		$('div.timecellcontainer:first').append('<div class ="addedcell" ></div>');
		var cur = $('div.timecellcontainer:first > div.addedcell');
		$(cur).attr('class-time', data[i]['numbers']);
		$(cur).attr('class-code', code);
		$(cur).attr('class-day', data[i]['days']);
		$(cur).attr('class-credit', selected['classCredit']);
		$(cur).css({'top' : ((data[i]['numbers'][0] - 1) * height) + firstHeight, 'left' : partial[dayofweek], 'width' : timeCellWidth, 'height' : height * data[i]['numbers'].length, background : colors[colorIdx]});
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
		$(cur).append('<span><em>' + data[i]['classes_loca'] + '</em></span>');
			if(overlapped == true) {
			$(cur).text("");
			$(cur).append('<span class = "font-white">' + "겹침ㅠ_ㅠ" + '</span>')
		}
		if(status == 1 && overlapped == false) {
			isAdded = true;
			for(var j = 0; j < data[i]['numbers'].length; j++) {
				timetable[getIdx(dayofweek, parseInt(data[i]['numbers'][j]))] = 1;
			}
		}
	}
	if(status == 1 && isAdded){
		total_credit = parseInt(selected["classCredit"]) + parseInt($('#total_credit').text());
		$('#total_credit').text(total_credit);
	}
	if(status == 1 && isAdded == false){
		alert("웹강은 추가 할 수 없습니다");
		return true;
	}

	window_size();
	return overlapped;
}

function getPartial(table_data) {
	var partial = new Array(6);
	partial[0] = $(table_data).eq(0).outerWidth();
	for(var i = 1; i < table_data.length; i++) {
		partial[i] = partial[i - 1] + $(table_data).eq(i).outerWidth();
	}
	return partial;
}

$(window).resize(function() {
	$(document).ready(function() {
		window_size();
		var dayofweek = ["월", "화", "수", "목", "금", "토"];
		var timeCellWidth = $('#timetable > thead > tr > th').eq(2).outerWidth();
		$('#timetable > thead > tr > th').not(':last').not(':first').outerWidth(timeCellWidth);
		var partial = getPartial($('#timetable > thead > tr > th'));
		for(var i = 0; i < 6; i++) {
			$('div.addedcell[class-day=' + dayofweek[i] + ']').css({"left" : partial[i], "width" : $('#timetable > thead > tr > th').eq(i + 1).outerWidth()});
		}
	});
});


$(document).ready(function() {
	window_size();
	var data = $('.courses');
	for(var i = 0; i < data.length; i++) {
		var selected = {
			code : $(data).eq(i).data('code'),
			time : $(data).eq(i).data('time'),
			instructor : $(data).eq(i).data('instructor'),
			className : $(data).eq(i).data('classname'),
			classCredit : $(data).eq(i).data('classcredit')
		}
		test(selected, 1);
	}
});


$('#table-clear').click(function(e) {
	e.preventDefault();
  e.stopPropagation();
	alert("사용하실 수 없습니다");
});


$('#share_button').click(function(e){
	e.preventDefault();
	FB.ui({
	  method: 'share',
	  href: window.location.href,
	}, function(response){});
});
