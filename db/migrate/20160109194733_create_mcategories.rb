class CreateMcategories < ActiveRecord::Migration
  def change
    create_table :mcategories do |t|
      t.references :major, index: true, foreign_key: true
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
