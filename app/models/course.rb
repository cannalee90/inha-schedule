class Course < ActiveRecord::Base
	scope :instructor, -> (param) {
		where('instructor like ?', "%" +  param + "%").where(visible: true, year: 2016, semester: "spring")
	}
	scope :title, -> (param) {
		where('title LIKE ?', "%" + param + "%").where(visible: true, year: 2016, semester: "spring")
	}
	scope :code, -> (param) {
		where('code LIKE ?', "%" + param + "%").where(visible: true, year: 2016, semester: "spring")
	}

	has_many :selections
	has_many :schedules, through: :selections

	has_many :mcategories
	has_many :majors, through: :mcategories
end
