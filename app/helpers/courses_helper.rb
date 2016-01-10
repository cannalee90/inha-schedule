module CoursesHelper

	def course_eval_help eval
		if eval == "절대평가"
			"절평"
		elsif eval == "상대평가"
			"상대"
		elsif eval.nil?
			""
		else
			"P/F"
		end
	end
	def course_type_help class_type
		class_type[0] + class_type[2]
	end

	def grade_type_help grade
		unless grade.nil?
			if(grade.length == 1)
				grade + "학년"
			else
				grade
			end
		else
			"전체"
		end
	end
	def crede_help credit
		credit
	end
	def mobile_info_help data
		 "<strong>" + "-" + data.instructor + "</strong>/" + grade_type_help(data.grade) + "/" + data.credit.to_s + "학점/" + course_eval_help(data.eval) + "/"+ data.code + "/" + data.time
	end

end
