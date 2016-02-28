class CoursesController < ApplicationController
  def index
  end



  def clear
    render "/courses/clear.js.erb"
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

    if(query.length >= 2)
        render "/courses/search.js.erb", :locals => {:re => @ret} #temporarliy added
    else
        render :template => "/courses/letterStrict.js.erb"
    end
  end

  def test
    render "/courses/search.js.erb",
           :locals => {:re => Major.find(params[:major_id]).courses.where(year: 2016, semester: "spring", visible: true)} #temporarliy added
  end

end
