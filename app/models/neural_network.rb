require 'singleton'

class NeuralNetwork
  class Persistence
    include Mongoid::Document
    # include Mongoid::Timestamps
    store_in collection: "neural_network"
    field :weights, type: Array
    field :data, type: Array
  end

  # def save(data)
  #   @data = (@data || []) + data
  # end
  #
  # def get_training_data
  #   @data
  # end

  require 'ruby-fann'
  private_class_method :new

  @@instance = nil
  def self.instance(options = {})
    @@instance ||= new(options)
  end

  def initialize(options = {})
    @neural_network = RubyFann::Standard.new({ :num_inputs=>5, :hidden_neurons=>[5], :num_outputs=>1 })
    # @model = Persistence.first_or_initialize
  end

  def train(inputs, outputs)
    # @model.inputs = (@model.inputs || []) + inputs
    # @model.outputs = (@model.outputs || []) + outputs

    @inputs = (@inputs || []) + inputs
    @outputs = (@outputs || []) + outputs
    @training_data = RubyFann::TrainData.new(inputs: @inputs, desired_outputs: @outputs)
    @neural_network.train_on_data(@training_data, 1000, 10, 0.1)

    # @model.weights = @neural_network.get_neurons().group_by(&:layer).sort.map! { |_,layer| layer.map!(&:value) }
    # @model.save
  end

  # def get_weights
  #   @model.weights
  # end

  # def get_training_data
  #   { inputs: @model.inputs, outputs: @model.outputs }
  # end
  #
  # def save(data)
  #   @model.data = (@model.data || []) + data
  #   @model.save
  # end
end
