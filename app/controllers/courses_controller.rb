class CoursesController < ApplicationController
  def index
  end



  def clear
    respond_to do |format|
      format.js {
        render :template => "/courses/clear.js.erb",
               :layout => false
      }
    end
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

      if(query.length >= 2)
        format.js {
          render :template => "/courses/search.js.erb",
                 :layout => false,
                 :locals => {:re => @ret} #temporarliy added
        }
      else
        format.js {
          render :template => "/courses/letterStrict.js.erb",
                 :layout => false
        }
      end
    end
  end

  def test
    respond_to do |format|
        format.js {
          render :template => "/courses/search.js.erb",
                 :layout => false,
                 :locals => {:re => Major.find(params[:major_id]).courses.where(year: 2016, semester: "spring")} #temporarliy added
        }
    end
  end

end
