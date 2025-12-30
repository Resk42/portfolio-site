const fs = require("fs").promises
const express = require("express")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001
const MESSAGES_FILE = path.join(__dirname, "messages.json")
const ADMIN_PASSWORD = "admin1234" // Hardcoded password

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname)))

// Helper to read messages
async function getMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Helper to save messages
async function saveMessages(messages) {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2))
}

// API: Save a message
app.post("/api/message", async (req, res) => {
  try {
    const { name, email, projectType, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const messages = await getMessages()
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      projectType: projectType || "General",
      message,
      datetime: new Date().toISOString(),
      status: "new",
    }

    messages.push(newMessage)
    await saveMessages(messages)

    console.log("New message saved:", newMessage)
    res.status(201).json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Error saving message:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// API: Get all messages (Protected)
app.get("/api/messages", async (req, res) => {
  try {
    // Simple auth check
    const authHeader = req.headers["authorization"]
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const messages = await getMessages()
    // Sort by date (newest first)
    messages.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    
    res.json(messages)
  } catch (error) {
    console.error("Error getting messages:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// API: Update message status (Protected)
app.patch("/api/messages/:id", async (req, res) => {
  try {
    // Simple auth check
    const authHeader = req.headers["authorization"]
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.params
    const { status } = req.body
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" })
    }

    const messages = await getMessages()
    const messageIndex = messages.findIndex(m => m.id === id)

    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" })
    }

    messages[messageIndex].status = status
    await saveMessages(messages)

    res.json({ success: true, message: "Status updated" })
  } catch (error) {
    console.error("Error updating message:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Serve the Admin Panel
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"))
})

app.get("/admin", (req, res) => {
  // Redirect to dashboard, client-side will check auth
  res.sendFile(path.join(__dirname, "admin", "dashboard.html"))
})

app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "dashboard.html"))
})

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/message`)
  console.log(`\n✨ Visit http://localhost:${PORT} to view the portfolio\n`)
})
