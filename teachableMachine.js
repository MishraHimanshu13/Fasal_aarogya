// teachableMachine.js
import * as tmImage from "@teachablemachine/image"

export class TeachableMachineIntegration {
  constructor(modelURL) {
    this.URL = modelURL
    this.model = null
    this.webcam = null
    this.maxPredictions = 0
  }

  async init() {
    try {
      const modelURL = this.URL + "model.json"
      const metadataURL = this.URL + "metadata.json"

      console.log("Loading model from:", modelURL)
      console.log("Loading metadata from:", metadataURL)

      // Load the model and metadata
      this.model = await tmImage.load(modelURL, metadataURL)
      this.maxPredictions = this.model.getTotalClasses()

      console.log("Model loaded successfully. Total classes:", this.maxPredictions)

      // Setup webcam
      const flip = true
      this.webcam = new tmImage.Webcam(200, 200, flip)
      await this.webcam.setup()
      await this.webcam.play()

      console.log("Webcam setup complete")

      return this.webcam.canvas
    } catch (error) {
      console.error("Error in TeachableMachineIntegration init:", error)
      throw error
    }
  }

  async predict() {
    if (!this.model || !this.webcam) {
      throw new Error("Model or webcam not initialized")
    }

    try {
      // Update the webcam frame
      this.webcam.update()

      // Make a prediction
      const prediction = await this.model.predict(this.webcam.canvas)
      return prediction
    } catch (error) {
      console.error("Error in prediction:", error)
      throw error
    }
  }

  async loop(callback) {
    if (!this.model || !this.webcam) {
      throw new Error("Model or webcam not initialized")
    }

    try {
      const prediction = await this.predict()
      callback(prediction)

      window.requestAnimationFrame(() => this.loop(callback))
    } catch (error) {
      console.error("Error in prediction loop:", error)
      throw error
    }
  }
}

