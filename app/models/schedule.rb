class Schedule < ActiveRecord::Base
	has_many :selections
	has_many :courses, through: :selections
end
