// app.js
import { TeachableMachineIntegration } from "./teachableMachine.js"

class App {
  constructor() {
    this.tm = new TeachableMachineIntegration("https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/")
    this.labelContainer = document.getElementById("label-container")
    this.errorContainer = document.getElementById("error-container")
  }

  async init() {
    try {
      console.log("Initializing app...")
      const webcamCanvas = await this.tm.init()
      document.getElementById("webcam-container").appendChild(webcamCanvas)

      for (let i = 0; i < this.tm.maxPredictions; i++) {
        this.labelContainer.appendChild(document.createElement("div"))
      }

      console.log("Starting prediction loop...")
      this.tm.loop(this.updatePredictions.bind(this))
    } catch (error) {
      console.error("Initialization failed:", error)
      this.errorContainer.textContent = "Initialization failed: " + error.message
    }
  }

  updatePredictions(predictions) {
    try {
      for (let i = 0; i < this.tm.maxPredictions; i++) {
        const classPrediction = predictions[i].className + ": " + predictions[i].probability.toFixed(2)
        this.labelContainer.childNodes[i].innerHTML = classPrediction
      }
    } catch (error) {
      console.error("Error updating predictions:", error)
      this.errorContainer.textContent = "Error updating predictions: " + error.message
    }
  }
}

// Initialize the app when the page loads
window.addEventListener("load", () => {
  console.log("Page loaded, initializing app...")
  const app = new App()
  app.init().catch((error) => {
    console.error("App initialization failed:", error)
    document.getElementById("error-container").textContent = "App initialization failed: " + error.message
  })
})

