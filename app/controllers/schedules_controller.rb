class SchedulesController < ApplicationController
	def show
		render json: Schedule.find(params[:id]).courses
	end
end
