class PongController < ActionController::Base
  layout 'application'

  def index
  end

  def hi
    render text: DateTime.now
  end
end
