class CoursesController < ApplicationController
  def index
  end

  def create
  end

  def new
  end

  def edit
  end

  def show
  end

  def update  
  end

  def destroy
  end

  def search
    @query = params[:query]
    Course.where('title LIKE ?','%공업%')
    @ret = Course.find(1)
    @ret = Course.where('title LIKE ?', "%" + params[:query] + "%")
    respond_to do |format|
        format.js {
          render :template => "/courses/search.js.erb", 
                 :layout => false,
                 :locals => {:re => @ret}
        }
    end
  end
end
