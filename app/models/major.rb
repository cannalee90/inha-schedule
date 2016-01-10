class Major < ActiveRecord::Base
	has_many :mcategories
	has_many :courses, through: :mcategories
end
