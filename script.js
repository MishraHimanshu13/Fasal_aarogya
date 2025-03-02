function loadScript(src, retries = 3) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = () => {
      if (retries > 0) {
        console.warn(`Failed to load ${src}, retrying... (${retries} attempts left)`)
        loadScript(src, retries - 1)
          .then(resolve)
          .catch(reject)
      } else {
        reject(new Error(`Failed to load ${src}`))
      }
    }
    document.head.appendChild(script)
  })
}

// Usage
async function loadDependencies() {
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js")
    await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js")
    console.log("All scripts loaded successfully")
    // Initialize your app here
    function init() {
      console.log("App initialized")
      // Add your initialization logic here
    }
    init()
  } catch (error) {
    console.error("Failed to load necessary scripts:", error)
    // Handle the error (e.g., show a message to the user)
  }
}

// Call this function when the page loads
window.addEventListener("load", loadDependencies)

