const getS = selector => document.querySelector(selector);

class User {
    constructor(data) {
        this.login = data.login;
        this.password = data.password;
        this.email = data.email;
    }
}

const formModule = (function () {
    let inputs;
    let editIndex = -1;


    function setHtml() {
        inputs = document.querySelectorAll('.inp')
        getS('#submit').addEventListener('click', addUser)
        for (let inp of inputs) {
            inp.valid = false;
            inp.addEventListener('input', e => {
                checkInput(e.target)
            })
        }
        getS('#submit').addEventListener('click', addUser)
    }

    function checkInput(elem) {
        let check = null;
        let value = elem.value;
        let list = {
            login: function () {
                return /^[a-zA-z]{4,16}$/.test(value)
            },
            password: function () {
                return /^[\w-\.]{4,16}$/.test(value)
            },
            email: function () {
                return /^[\w-\.]{1,}@[\w-\.]{1,}\.com|ua|ru|org|pl$/.test(value)
            },
        }
        if (elem.classList.contains('inp')) {
            check = list[elem.id]()
        }
        addValidationStatus(elem, check)
    }

    function clear() {
        for (let inp of inputs) {
            inp.valid = false;
            inp.value = ''
            inp.classList.remove('success')

        }
        getS('#submit').disabled = true
        editIndex = -1
    }

    function checkValid() {
        let promise = new Promise((resolve, reject) => {
            let permission = true;
            for (let inp of inputs) {
                if (inp.valid == false) permission = false
            }
            resolve(permission)
        })
        promise.then(permission => {
            if (permission) getS('#submit').disabled = false;
        })
    }

    function edit(data, i) {
        editIndex = i
        inputs[0].value = data.login
        inputs[1].value = data.password
        inputs[2].value = data.email
        for (let inp of inputs) {
            checkInput(inp)
        }
    }

    function addValidationStatus(elem, bool) {
        if (bool) {
            elem.classList.remove('alert')
            elem.classList.add('success')
            elem.valid = true
        } else {
            elem.classList.remove('success')
            elem.classList.add('alert')
            elem.valid = false
        }
        checkValid()
    }

    function addUser() {
        let user = new User({
            login: inputs[0].value,
            password: inputs[1].value,
            email: inputs[2].value
        })
        if (editIndex > -1) {
            tableModule.refresh(user, +editIndex)
        } else {
            tableModule.add(user)
        }
        clear()
    }

    function init() {
        setHtml()
    }
    return {
        init: init,
        edit: edit
    }
})()


const tableModule = (function () {
    const users = []

    let tableBody;

    function setHtml() {
        tableBody = getS('#tbody')
        tableBody.addEventListener('click', e => {
            if (e.target.classList.contains('edit')) edit(e.target)
            else if (e.target.classList.contains('del')) remove(e.target)
        })
    }

    function add(user) {
        users.push(user)
        render()
    }

    function edit(elem) {
        let index = elem.parentElement.parentElement.getAttribute('data-index')
        formModule.edit(users[+index], +index)
    }

    function refresh(data, i) {
        users[i].login = data.login;
        users[i].password = data.password;
        users[i].email = data.email;
        render()
    }

    function remove(elem) {
        let index = elem.parentElement.parentElement.getAttribute('data-index')
        users.splice(index, 1)
        render()
    }

    function render() {
        if (users.length >= 0) {
            tableBody.innerHTML = '';
            users.forEach((user, i) => {
                let tr = document.createElement('tr')
                tr.setAttribute('data-index', i)
                tr.innerHTML = `<td>${i + 1}</td><td>${user.login}</td><td>${user.password}</td><td>${user.email}</td><td><button class='edit'>Edit</button></td><td><button class='del'>Delete</button></td>`;
                tableBody.append(tr)
            })
        }
    }

    function init() {
        setHtml()
    }
    return {
        add: add,
        refresh: refresh,
        init: init
    }
})()
tableModule.init();
formModule.init();
