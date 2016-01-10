class Schedule < ActiveRecord::Base
	after_save :check_year

	has_many :selections
	has_many :courses, through: :selections

end
