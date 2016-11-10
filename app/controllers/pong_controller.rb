class PongController < ActionController::Base
  layout 'application'

  def index
  end

  def hi
    render json: DateTime.now
  end
end
