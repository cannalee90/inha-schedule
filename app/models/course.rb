class Course < ActiveRecord::Base
	scope :instructor, -> (param) {
		where('instructor like ?', "%" +  param + "%")
	}
	scope :title, -> (param) {
		where('title LIKE ?', "%" + param + "%")
	}
	scope :code, -> (param) {
		where('code LIKE ?', "%" + param + "%")
	}
	
	has_many :selections
	has_many :schedules, through: :selections	
end
