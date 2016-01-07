class CreateSelections < ActiveRecord::Migration
  def change
    create_table :selections do |t|
      t.references :schedule, index: true, foreign_key: true
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
