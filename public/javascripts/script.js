window.onload = function() {

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.btnLogin-popup');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const lgnFormBtn = document.querySelector('#login-btn');
const rgstrFormBtn = document.querySelector('#rgstr-btn');
const logOutBtn = document.querySelector('#logout-btn');

if (registerLink)
    registerLink.addEventListener('click', ()=> {
        document.getElementById('id01').style.display='block';
        document.querySelector('#login-contain').style.display = 'none';
    });

if (loginLink)
    loginLink.addEventListener('click', function(e) {
        document.querySelector('#login-contain').style.display = 'block';
    });

if (iconClose)
    iconClose.addEventListener('click', ()=> {
        document.querySelector('#login-contain').style.display = 'none';
    })

const Accounts = {
    cur: null,
    dat: {},
    Load: function(uname) {
        if (typeof uname == 'string') {
            document.querySelector('.btnLogin-popup').style.display = 'none';
            document.querySelector('#logged-in-uname').style.display = 'block';
            logOutBtn.style.display = 'block';
            document.querySelector('#logged-in-uname').innerText = uname;
            return;
        }

        //look jwt
        let tok = localStorage.getItem('login-token');

        if (!tok) return;

        fetch('/verify', {
            body: JSON.stringify({
                token: tok
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        }).then(async function(res) {
            if (res.status == 200) {
                const dat = await res.json();
                Accounts.Load(dat.email);
            } else {
                localStorage.setItem('login-token', null);
            }
        })
    },
    Login: async function(u,p) {
        console.log('attempting login...');
        fetch('/login', {
            body: JSON.stringify({
                email: u,
                password: p
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        }).then(async function(res) {
            console.log(res.status);

            const dat = await res.json();
            if (res.status == 200) {
                localStorage.setItem('login-token', dat.token);
                document.querySelector('#login-contain').style.display = 'none';
                Accounts.Load(u);
                return 0;
            } else {
                alert('Login error! Code: '+res.status+" | "+JSON.stringify(dat))
                return 2;
            }
        }).then(function(err) {
            console.warn(err.message);
        })

        return 1;
    },
    Register: function(u,p,inf) {
        onRegister(function(res) {
            if (res.status != 200) {
                alert('Failed to register user!');
                return;
            }

            if (!Accounts.Login(u,p)) {
                Accounts.Load(u);
            }
        });
        return 0;
    },
    PageClose: function() {
        localStorage.setItem('u-store',JSON.stringify(this.dat));
    },
    CreateSession: function(t) {
        if (typeof this.cur.u == typeof "") {
            localStorage.setItem('login', JSON.stringify({u:this.cur.u,expr:t}));
        }
    }
}

if (lgnFormBtn) {
    lgnFormBtn.addEventListener('click', function(e) {
        const pField = document.querySelector("#login-field-pass"),
              uField = document.querySelector("#login-field-email");

        switch (Accounts.Login(uField.value, pField.value)) {
        default: break;
        }
    });
}

if (rgstrFormBtn) {
    rgstrFormBtn.addEventListener('click', function(e) {
        const pField = document.querySelector("#rgstr-pass"),
              uField = document.querySelector("#rgstr-email");

        switch (Accounts.Register(uField.value, pField.value, {
            name: document.querySelector('#register-name')
        })) {
        case 1:
            alert("That email already has an account!");
            break;
        case 0:
            document.querySelector('#id01').style.display = 'none';
            onRegister();
            break;
        default:
            alert("Unable to register account!");
            break;
        }
    })
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', function(e) {
        document.querySelector('.btnLogin-popup').style.display = 'block';
        document.querySelector('#logged-in-uname').style.display = 'none';
        logOutBtn.style.display = 'none';
        document.querySelector('#logged-in-uname').innerText = "";
        localStorage.setItem('login-token',null);
    })
}

Accounts.Load();
}

function getInfo() {
    return JSON.stringify({
        name: document.querySelector("#rgstr-name").value,
        address: document.querySelector("#rgstr-addr").value,
        phone: document.querySelector("#rgstr-phone").value,
        petType: document.querySelector("#rgstr-pet-ty").value,
        petName: document.querySelector("#rgstr-pet-name").value,
        email: document.querySelector("#rgstr-email").value,
        password: document.querySelector("#rgstr-pass").value
    })
}

async function onRegister(next) {
    console.log('Registering user!');
    const inf = getInfo();
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: inf
    }).then(function (res) {
        console.log('Response:', res.json());
        next(res);
    }).then(function(something) {
        console.log(something.json());
    })
}