const express = require('express')
const session = require('express-session')
const app = express()
const messages = ['hello world']

app.use(session({
  secret: 'cybersec',
  cookie: {httpOnly: false}
}))

app.get('/', (req, res) => {
  if (req.session.user) {
    res.send('<img src="/logo.png">Hello ' + req.session.user + '<h3>messages</h3>' + messages.join('<br>') + '<form action="/msg"><input name="msg" placeholder="new message"><input type="submit"></form>' + '<h4><a href="/logout">logout</a></h4>')
  } else {
    res.send('<form action="/login"><input name="name" placeholder="name"><input name="pwd" placeholder="password"><input type="submit"></form>')
  }
})

app.get('/login', (req, res) => {
  if (req.query.name == 'cyber' && req.query.pwd == 'sec') {
    req.session.user = req.query.name
    res.redirect('/')
  } else {
    res.send('Invalid login')
  }
})

app.get('/logout', (req, res) => {
  delete req.session.user
  res.redirect(req.query.dest ? req.query.dest : '/')
})

app.get('/msg', (req, res) => {
  messages.push(req.query.msg
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;'))
  res.redirect('/')
})

app.use(express.static('static'))

app.listen(3000, () => console.log('Listening on port 3000!'))
