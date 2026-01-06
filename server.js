const fs = require("fs").promises
const express = require("express")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))

const app = express()
const PORT = process.env.PORT || 3001
const MESSAGES_FILE = path.join(__dirname, "messages.json")
const ADMIN_PASSWORD = "Zlataonelove" // TODO: move to env later

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname)))

// =======================
// Helpers
// =======================

async function getMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveMessages(messages) {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2))
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error("❌ Telegram env vars missing")
    return
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })
    console.log("✅ Telegram message sent")
  } catch (err) {
    console.error("❌ Telegram error:", err)
  }
}

// =======================
// API
// =======================

// Save new message
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

    const telegramText = `
📩 New portfolio message

👤 Name: ${name}
📧 Email: ${email}
📦 Project: ${projectType || "General"}

📝 Message:
${message}
`

    await sendTelegramMessage(telegramText)

    console.log("New message saved:", newMessage)
    res.status(201).json({ success: true })
  } catch (error) {
    console.error("Error saving message:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all messages (admin)
app.get("/api/messages", async (req, res) => {
  const auth = req.headers["authorization"]
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const messages = await getMessages()
  messages.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
  res.json(messages)
})

// Update message status
app.patch("/api/messages/:id", async (req, res) => {
  const auth = req.headers["authorization"]
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.params
  const { status } = req.body

  const messages = await getMessages()
  const index = messages.findIndex(m => m.id === id)

  if (index === -1) {
    return res.status(404).json({ error: "Message not found" })
  }

  messages[index].status = status
  await saveMessages(messages)

  res.json({ success: true })
})

// =======================
// Pages
// =======================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dashboard.html"))
})

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dashboard.html"))
})

// Health
app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})

// =======================
// Start
// =======================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
