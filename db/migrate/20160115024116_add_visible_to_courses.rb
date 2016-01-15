class AddVisibleToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :visible, :boolean, :default => true
  end
end
