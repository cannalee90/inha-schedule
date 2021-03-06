var colors = new Array("#EAA678","#63C2A2","#89C4F4","#E08283","#F5D76E",  "#C8F7C5", "#E4F1FE", "#C5EFF7", "#A2DED0","#DCC6E0", "#F1A9A0","#FDE3A7", "#ECEECE");
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
		//점심시간 껴있는 시간표 개극혐 시팍
		for(var i = 0; i < didx; i++)  {
			for(var j = 1; j < data[i]['numbers'].length; j++) {
				if(parseInt(data[i]['numbers'][j - 1]) + 1 != parseInt(data[i]['numbers'][j])) {

					data[didx] = new Array();
					data[didx]['days'] = data[i]['days'];
					data[didx]['classes_loca'] = data[i]['classes_loca'];
					data[didx]['numbers'] = data[i]['numbers'].slice(j, data[i]['numbers'].length);
					data[didx]['']
					 while(data[i]['numbers'].length > j) {
					 	data[i]['numbers'].pop();
					 }
					didx++;
				}
			}
		}

		return data;
	}
	if(selected['time'] == 'TBA') {
		return true;
	}
	var time = selected['time'];
	var instructor = selected['instructor'];
	var className = selected['className'];
	var code = selected['code'];
	var data = modified(time);
	var overlapped = false;
	var isAdded = false;
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

	/*수업을 추가 할 수 없는 조건*/
	if(overlapped == true && status == 1){
		alert("시간이 겹칩니다 ㅠ_ㅠ");
		status = 0;
	}
//	console.log(colors.length);
	if(colors.length == localStorage.length + 1) {
		alert("헤르미온느이신가요? ㅠ_ㅠ 더이상은 추가 안되요");
		status = 0;
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
		if(data[i]['days'] == '토') {
			if(status == 0){
				alert("토요일 수업은 나타나지 않습니다");
			}
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
		$(cur).css({'top' : ((data[i]['numbers'][0] - 1) * height) + firstHeight, 'left' : partial[dayofweek], 'width' : timeCellWidth, 'height' : height * data[i]['numbers'].length, background : colors[colorIdx], 'z-index': '200'});
		if(status == 1){
			$(cur).attr('class-color', colorIdx);
		}
		else{
			$(cur).attr('status', 'tmp');
			$(cur).css({'background' : 'grey', 'opacity' : 0.8, 'z-index' : 201});
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

		var dayofweek = ["월", "화", "수", "목", "금", "토"];
		var timeCellWidth = $('#timetable > thead > tr > th').eq(2).outerWidth();
		$('#timetable > thead > tr > th').not(':last').not(':first').outerWidth(timeCellWidth);
		var partial = getPartial($('#timetable > thead > tr > th'));
		for(var i = 0; i < 6; i++) {
			$('div.addedcell[class-day=' + dayofweek[i] + ']').css({"left" : partial[i], "width" : $('#timetable > thead > tr > th').eq(i + 1).outerWidth()});
		}

	});
});


$(document).on('click', 'div.addedcell' , function() {
	var selectors = $(this).attr('class-code');
	var cells = $('div.addedcell[class-code=' + selectors + ']');
	if($(this).attr('status') != "tmp") {
		total_credit = parseInt($('#total_credit').text()) - parseInt($(this).attr('class-credit'));
		$('#total_credit').text(total_credit);
		for(var i = 0; i < $(cells).length; i++) {
			var timeArray = $(cells).eq(i).attr('class-time').split(',');
			var dayofweek = isDay($(cells).eq(i).attr('class-day'));
			for(var j = 0; j < timeArray.length; j++) {
				delete timetable[getIdx(dayofweek, timeArray[j])];
			}
			//if($('div.addedcell[status=tmp]') != null) {

			//}
		}
		delete codeHash[selectors.split('-')[0]];
		delete colorHash[$(this).attr('class-color')];
		localStorage.removeItem(selectors);
		$(cells).filter('[stauts!="tmp"]').parent().remove();
	}else {
		$(cells).filter('[status="tmp"]').parent().remove();
	}
});


$(document).on('click', '#search_result > tbody> tr', function() {
	$('span#added').remove();
	$('div.addedcell[status=tmp]').parent().remove();

	$(this).children().eq(1).append('<span class = "label label-primary" id = "added">추가</span>')
	$(this).children(':last-child').append('<span class = "label label-primary" id = "added">추가</span>')

	var selected = {
		code : $(this).data('code'),
		time : $(this).data('link'),
		class_id : $(this).data('id'),
		className : $(this).children(':nth-child(2)').children(':nth-child(1)').text(),
		instructor : $(this).children(':nth-child(7)').text(),
		classCredit : $(this).children(':nth-child(4)').text(),
		class_year : $(this).data('year'),
		class_semester : $(this).data('semester')
	}
	test(selected, 0);
})

$(document).on('click', 'span#added', function(e) {
	e.stopPropagation();
	var selected = {
		code : $(this).parent().parent().data('code'),
		time : $(this).parent().parent().data('link'),
		instructor : $(this).parent().parent().children(':nth-child(7)').text(),
		className : $(this).parent().parent().children(':nth-child(2)').children(':nth-child(1)').text(),
		classCredit : $(this).parent().parent().children(':nth-child(4)').text(),
		class_id : $(this).parent().parent().data('id'),
		class_year : $(this).data('year'),
		class_semester : $(this).data('semester')
	}
	if(test(selected, 1) == false) {
		localStorage.setItem(selected['code'], JSON.stringify(selected));
		var cell = $('div.addedcell');
			for(var i = 0; i < $(cell).length; i++) {
				if($(cell).eq(i).attr('status') == "tmp") {
					$(cell).eq(i).parent().remove();
				}
			}
	}
})

$(document).ready(function() {
	for(var key in window.localStorage){
		var selected = JSON.parse(localStorage.getItem(key));
  	test(selected, 1);
	}
});


$('#class-save').click(function() {
	var data = new Array();
	if(localStorage.length == 0) {
		alert("1개이상 수업을 선택해주세요");
		return false;
	}
	for(var i in localStorage) {
		data.push(JSON.parse(localStorage[i])['class_id']);
	}
	$.ajax({
		type: "post",
		url : "/schedules",
		data: {class_id: data},
		success: function(data, status){
	  	location.href='/schedules/' + data;
	  },
	 	error: function(e) {
	 		alert("문제가 발생했습니다. 다시 시도해 주세요");
	 	}
	});
});

$('#majorselector').change(function() {
	$.ajax({
		type: "post",
		url : "/courses/test",
		data: {major_id: this.options[this.selectedIndex].value},
	 	error: function(e) {
	 		alert("다시 시도해 주세요.");
	 	}
	});
});
