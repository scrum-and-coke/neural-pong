class NeuralNetworkChannel < ApplicationCable::Channel

  def train
    @neural_network ||= NeuralNetwork.instance
    inputs = @training_set.collect { |e| e[:input] }
    outputs = @training_set.collect { |e| e[:output] }
    @neural_network.train(inputs, outputs)
  end

  def store(data)
    @training_set ||= []
    @training_set << data.symbolize_keys!
  end

  def move(data)
    transmit(data['ball']['y'] <=> data['paddle']['y'])
  end
end
