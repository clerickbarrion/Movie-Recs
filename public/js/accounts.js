const host = window.location.origin

class AccountHandler {
    constructor(){
        this.signUpBtn = document.getElementById('signupBtn')
        this.logInBtn = document.getElementById('loginBtn')
        this.signUpPage = document.getElementById('sign-up-page')
        this.logInPage = document.getElementById('log-in-page')
        this.closeBtns = document.getElementsByClassName('close')
        this.createAccountBtn = document.getElementById('create-account')
        this.createUsername = document.getElementById('create-username')
        this.createPassword = document.getElementById('create-password')
        this.confirmPassword = document.getElementById('confirm-password')
        this.message = document.getElementById('message')
        this.createAccountError = document.getElementById('create-account-error')
        this.loggedIn = document.getElementById('logged-in')
        this.logOutBtn = document.getElementById('log-out')
        this.username = document.getElementById('username')
        this.loginUsername = document.getElementById('login-username')
        this.loginPassword = document.getElementById('login-password')
        this.loginError = document.getElementById('log-in-error')
        this.login = document.getElementById('login')

        Array.from(this.closeBtns).forEach(button =>{
            button.addEventListener('click', ()=>{
                button.parentNode.style.display = 'none'
            })
        })
        this.signUpBtn.addEventListener('click',()=>{
            this.signUpPage.style.display = 'flex'
        })
        this.logInBtn.addEventListener('click',()=>{
            this.logInPage.style.display = 'flex'
        })

        this.createAccountBtn.addEventListener('click',()=>{
            if (this.createUsername.value && this.createUsername.value.length < 21 && this.createPassword.value && this.confirmPassword.value && this.createPassword.value === this.confirmPassword.value){
                const data = {
                    user: this.createUsername.value,
                    password: this.createPassword.value
                }
                fetch(`${host}/api/signUp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json()).then(obj => {
                    if (obj.result.error) {
                        this.createAccountError.style.display = 'block'
                        this.createAccountError.textContent = obj.result.error
                    }
                    else {
                        this.createAccountBtn.parentNode.style = 'none'
                        this.message.style.display = 'flex';
                        this.message.innerText = 'Account Created'
                        this.createAccountError.style.display = 'none'
                        setTimeout(()=>{this.message.style.display='none'},3000)
                        localStorage.setItem('user',data.user)
                        this.userInit()
                    }
                })
            } else if (this.createUsername.value.length > 20) {
                this.createAccountError.style.display = 'block'
                this.createAccountError.innerText = 'Username too long'
            } else if (this.createPassword.value !== this.confirmPassword.value) {
                this.createAccountError.style.display = 'block'
                this.createAccountError.innerText = 'Passwords do not match'
            }
        })
        this.logOutBtn.addEventListener('click', ()=>{
            localStorage.setItem('user', 'ANONYMOUS')
            this.userInit()
        })
        this.login.addEventListener('click',()=>{
            fetch(`${host}/api/login?user=${this.loginUsername.value}&password=${this.loginPassword.value}`).then(res => res.json()).then(obj => {
                if (obj.result.error) {
                    this.loginError.style.display = 'block'
                    this.loginError.textContent = obj.result.error
                }
                else {
                    this.loginError.parentNode.style = 'none'
                    this.message.style.display = 'flex';
                    this.message.innerText = `Logged in as ${this.loginUsername.value}`
                    this.loginError.style.display = 'none'
                    setTimeout(()=>{this.message.style.display='none'},3000)
                    localStorage.setItem('user',this.loginUsername.value)
                    this.userInit()
                }
            })
        })

    }
    userInit(){
        let user = localStorage.getItem('user')
        if (!user || user === 'ANONYMOUS') {
            localStorage.setItem('user', 'ANONYMOUS')
            this.signUpBtn.parentElement.style.display = 'flex'
            this.loggedIn.style.display = 'none'
        } 
        else if (user !== 'ANONYMOUS'){
            this.signUpBtn.parentElement.style.display = 'none'
            this.loggedIn.style.display = 'flex'
            this.username.textContent = user
        }
    }
}
const account = new AccountHandler
account.userInit()