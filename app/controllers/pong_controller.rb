class PongController < ActionController::Base
  layout 'application'

  def index
  end

  def get_network
    @network = NeuralNetwork.get_network
  end

  def hi
    render json: { date: DateTime.now }
  end

end
