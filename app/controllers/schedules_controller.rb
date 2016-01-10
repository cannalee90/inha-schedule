class SchedulesController < ApplicationController
	def show
		@courses = Schedule.find(params[:id]).courses
	end
	
	def create
		id = params[:class_id]
		s = Schedule.new
		id.each do |d|
			s.selections.build(course_id: d)
		end

		if s.save
			render json: s.id
		end
	end


end
