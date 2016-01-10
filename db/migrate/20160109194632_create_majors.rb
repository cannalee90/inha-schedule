class CreateMajors < ActiveRecord::Migration
  def change
    create_table :majors do |t|
      t.string :title

      t.timestamps null: false
    end
  end
end
