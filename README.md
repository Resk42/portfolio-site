# Yaromir Anohin - Web3 Portfolio (HTML Version)

A minimalist, high-contrast dark theme portfolio website built with pure HTML, CSS, and JavaScript, powered by an Express.js backend.

## 🚀 Quick Start

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy the environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Add your profile image:
   - Place `image.png` in the `html-version` folder

### Running the Server

Development mode (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will start on `http://localhost:3001`

## 📁 Project Structure

\`\`\`
html-version/
├── index.html          # Main HTML file with embedded CSS and JS
├── server.js           # Express server with contact form API
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
├── .env               # Your environment variables (create this)
├── image.png          # Your profile photo
└── README.md          # This file
\`\`\`

## ✨ Features

- **Pure HTML/CSS/JS** - No build tools required
- **Minimalist Design** - Inspired by alexanderengine.com
- **Dark Theme** - High contrast black background with white typography
- **Smooth Animations** - Fade-in effects on scroll
- **Responsive Layout** - Works on all screen sizes
- **Contact Form Backend** - Express API endpoint
- **Easy Deployment** - Deploy to any Node.js hosting

## 📧 Contact Form Setup

The contact form currently logs submissions to the console. To send actual emails:

### Option 1: Nodemailer (SMTP)

1. Install nodemailer:
\`\`\`bash
npm install nodemailer
\`\`\`

2. Uncomment the nodemailer code in `server.js`

3. Add to `.env`:
\`\`\`env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
\`\`\`

### Option 2: SendGrid

1. Install SendGrid:
\`\`\`bash
npm install @sendgrid/mail
\`\`\`

2. Add to `server.js`:
\`\`\`javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'anohquantum@gmail.com',
  from: process.env.EMAIL_USER,
  replyTo: email,
  subject: `Portfolio Contact: ${name}`,
  text: message
});
\`\`\`

3. Add to `.env`:
\`\`\`env
SENDGRID_API_KEY=your-api-key
EMAIL_USER=verified-sender@yourdomain.com
\`\`\`

### Option 3: Other Services

The server also supports:
- AWS SES
- Mailgun
- Postmark
- Resend

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Deploy:
\`\`\`bash
vercel
\`\`\`

### Deploy to Railway

1. Install Railway CLI:
\`\`\`bash
npm install -g @railway/cli
\`\`\`

2. Deploy:
\`\`\`bash
railway init
railway up
\`\`\`

### Deploy to Render

1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`

### Deploy to Heroku

1. Install Heroku CLI
2. Deploy:
\`\`\`bash
heroku create yaromir-portfolio
git push heroku main
\`\`\`

## 🔧 Customization

### Change Colors

Edit the CSS variables in `index.html`:
\`\`\`css
/* Background and text colors */
background-color: #000000;
color: #ffffff;

/* Accent colors */
border-color: #1a1a1a;
\`\`\`

### Change Port

Edit `.env`:
\`\`\`env
PORT=3001
\`\`\`

Or pass as environment variable:
\`\`\`bash
PORT=8080 npm start
\`\`\`

### Add Analytics

Add before `</head>` in `index.html`:
\`\`\`html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
\`\`\`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `EMAIL_SERVICE` | Email service provider | No |
| `EMAIL_USER` | Sender email address | No |
| `EMAIL_PASSWORD` | Email password/API key | No |
| `CONTACT_EMAIL` | Recipient email | No |

## 🐛 Troubleshooting

### Port already in use
\`\`\`bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
\`\`\`

### Image not loading
- Ensure `image.png` is in the `html-version` folder
- Check file permissions
- Verify the path in `index.html` is correct

### Form not submitting
- Check browser console for errors
- Verify server is running
- Check network tab in DevTools
- Ensure `/api/contact` endpoint is accessible

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Support

For questions or issues:
- Email: anohquantum@gmail.com
- Telegram: @anohinquantum
