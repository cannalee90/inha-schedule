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
end
