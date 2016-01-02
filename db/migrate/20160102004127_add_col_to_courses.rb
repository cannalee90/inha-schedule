class AddColToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :semester, :string
    add_column :courses, :year, :int
  end
end
