class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :group
      t.string :title
      t.string :grade
      t.integer :credit
      t.string :class_type
      t.string :time
      t.string :instructor
      t.string :eval
      t.string :etc
      t.string :code
      t.string :group

      t.timestamps null: false
    end
  end
end
