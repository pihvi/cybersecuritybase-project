This report is in more readable format at:
https://github.com/pihvi/cybersecuritybase-project


## Setup
1. Install latest Node.js, instructions here https://nodejs.org
2. Download code from here https://github.com/pihvi/cybersecuritybase-project
3. In the code folder run "npm start"

## Vulnerabilities
### Issue 1: A3-Cross-Site Scripting
Application allows posting content that others can then see on the application front page. This gives a possibility to do XSS attacks. All input from outside sources should be escaped.
Steps to reproduce:
1. Open http://localhost:3000
2. Login with name "cyber"" and password "sec"
3. Submit a new message "<script>alert('pawned')</script>"
4. Script given in message is executed in the browser and alert "pawned" is shown.

### Issue 2: A4-Insecure Direct Object References
Application serves static web content i.e. logo in this case to the user in the front page. This might allow other secret content to be accidentaly available in the same folder. Only the content meant for outside should be served from the server.
Steps to reproduce:
1. Open http://localhost:3000/index.js
2. Source code and secrets inside it can be read by anyone.

### Issue 3: A5-Security Misconfiguration
Appllication uses sessions to identify logged in users. Identifying is based on id in a cookie. This cookie should not be made available through JavaScript as it enables session hijacking attacks.
Steps to reproduce:
1. Open http://localhost:3000
2. Login with name "cyber"" and password "sec"
3. Submit a new message "<script>alert(document.cookie)</script>"
4. Session id is shown in alert message i.e. it can be accessed with JavaScript and is vulnerable to session hijacking.

### Issue 4: A6-Sensitive Data Exposure
Application uses username and passwords to identify users. Passwords should be stored safely and in a way that even when they might be leaked, they can not be easily identified.
Steps to reproduce:
1. Open http://localhost:3000/index.js
2. Password "sec" can be read in plain text.

### Issue 5: A7-Missing Function Level Access Control
Apllication is meant only for logged in users, but some endpoints might be missing checks that user is actually logged in. Users can not access the front page without loggin in first and thus they can not see the message posting form before logging in. But when posting the message with the form, the logged in check should also be made.
Steps to reproduce:
1. Logout if you are logged in (http://localhost:3000/logout)
2. Open http://localhost:3000/msg?msg=this+should+not+work
3. Login with name "cyber"" and password "sec"
4. See message "this should not work" could be posted without being logged in.

### Issue 6: A8-Cross-Site Request Forgery (CSRF)
Opening links in a phishing email should not be able to modify application data. This can be prevented by adding a session unique secret CSRF token.
Steps to reproduce:
1. Open http://localhost:3000 to first tab
2. Login with name "cyber"" and password "sec"
3. Open http://localhost:3000/msg?msg=this+also+should+not+work in another tab
4. Reload first tab
5. Message "this also should not work" has appeared on the list

### Issue 7: A9-Using Components with Known Vulnerabilities
Apllication uses dependencies. They should be kept up to date so they would not contain vulnerabilities.
Steps to reproduce:
1. Look into package.json file and see the dependency "express" is at version "4.4.0"
2. See that express version 4.4.0 is listed as affected with vulnerability: https://www.cvedetails.com/cve/CVE-2014-6393/

### Issue 8: A10-Unvalidated Redirects and Forwards
Application redirects user after login. These redirections should not be made changeable from outside.
Steps to reproduce:
1. Open http://localhost:3000/logout?dest=https://google.com
2. See that you were redirected to Google i.e. outside the application.

## Fixes for vulnerabilities
### Fix 1: A3-Cross-Site Scripting
The message content should be escaped before rendered to html page. This includes "<" and ">" tags so script or other html content can not be injected to the page.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/bfa5e41c47a8b3d0477d219ebb05cfa8b93aa510

### Fix 2: A4-Insecure Direct Object References
The static files (logo.png) should be moved to own folder and only that folder should be exposed as static content.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/602a79a589b0127dbb95b289aee7c53bf28485f6

### Fix 3: A5-Security Misconfiguration
The cookie should be made http-only so it can not be read with JavaScript.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/143aae00d8fd6a49aee58571b74c1f812e325969

### Fix 4: A6-Sensitive Data Exposure
Passwords should be stored hashed so that it's not even possible to know what is the original password.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/0533ab99c53528e8e24469b1a1313687337ff5f4

### Fix 5: A7-Missing Function Level Access Control
Function accepting the messages should check the user is logged in.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/eb44085e843a0f89390b31a896b69209d296fa37

### Fix 6: A8-Cross-Site Request Forgery (CSRF)
A unique CSRF token should be stored in users session and rendered to the users message posting form as hidden input so when message is posted this token can be verified serverside. 

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/f04fc4e0066467306a72e63beb52e2c697fde1d4

### Fix 7: A9-Using Components with Known Vulnerabilities
The express dependency should be updated to the latest version (4.16.2) that is not listed as containing a vulnerability. Also some automation to help keep dependencies up to date would be a good idea. For this project it could be for instance https://greenkeeper.io/

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/857556c0ebac1eee50ed972907161f2ac462f3c4

### Fix 8: A10-Unvalidated Redirects and Forwards
At logout the user should just be redirected to application front page and not allow the redirection be given in a parameter.

Code for the fix: https://github.com/pihvi/cybersecuritybase-project/commit/ea0ee3914db0efe5f8a2511a6cd0ca99838e7bd2
