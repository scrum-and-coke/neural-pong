class PongController < ActionController::Base
  layout 'application'

  def index
  end

  def upload_training_data
    @neural_network ||= NeuralNetwork.new
    @neural_network.save(JSON.parse(train_params[:data]))
    render json: @neural_network.get_training_data
  end

  def get_training_data
    # @neural_network ||= NeuralNetwork.instance
    render json: @neural_network.get_training_data
  end

  # def train
  #   @inputs = train_params[:inputs]
  #   @outputs = train_params[:outputs]
  #   @neural_network ||= NeuralNetwork.instance
  #   @neural_network.train(@inputs, @outputs)
  #
  #   render json: @neural_network.get_weights
  # end

  def hi
    render json: { date: DateTime.now }
  end

  private

  def train_params
    params.permit(:data)
  end
end
