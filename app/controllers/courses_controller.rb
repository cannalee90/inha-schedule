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

  def clear
    respond_to do |format|
      format.js {
        render :template => "/courses/clear.js.erb", 
               :layout => false
      }
    end
  end

  def update  
  end

  def destroy
  end

  def search
    query = params[:query].strip
    if params[:query_kind] == "2"
      @ret = Course.instructor(query)
    elsif params[:query_kind] == "3"
      @ret = Course.code(query)
    else
      @ret = Course.title(query)
      @ret = (@ret.count == 0) ? Course.title('%' + query.gsub!(/(.)/){$1.concat('%')}) : @ret
    end
    respond_to do |format|
        format.js {
          render :template => "/courses/search.js.erb", 
                 :layout => false,
                 :locals => {:re => @ret}
        }
    end
  end

  def local
  end
  
end
