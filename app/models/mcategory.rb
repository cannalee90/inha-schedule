class Mcategory < ActiveRecord::Base
  belongs_to :major
  belongs_to :course
end
