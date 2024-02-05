document.addEventListener('DOMContentLoaded', function () {
  //here is the some starting accounts beacuse of unavailibility of sign up//
  let user = [{
    username: 'Hamza Hussain',
    deposited_amount: 12000,
    loan: [],
    pin: 1111,
    movement: []
  },
  {
    username: 'Syed Rohan Ali',
    deposited_amount: 15000,
    loan: [],
    pin: 2222,
    movement: []
  },
  {
    username: 'Ammad Siddique',
    deposited_amount: 20000,
    loan: [],
    pin: 3333,
    movement: []
  }]

  let id = -1;
  const now = new Date();
  let container1
  let container2

  //calculate Summary Out..//
  const calculate_Out = function () {
    let sum = 0
    user[id].movement.forEach(function (item, index) {
      sum = sum + parseInt(item.transfer_amount)
    })
    return sum
  }
  //calculate Summary Interest i take 5% interest..//
  const calculate_Interest = function () {
    let interest = (5 / 100) * user[id].deposited_amount
    return interest
  }


  //bring user details from local storage//
  const getsaveduser = function () {
    const JSONuser = localStorage.getItem('users');
    if (JSONuser !== null) {
      return JSON.parse(JSONuser);
    } else {
      return [];
    }
  }
  //bring user id from the local storage//
  const getsavedid = function () {
    const JSONid = localStorage.getItem('id');
    if (JSONid !== null) {
      return JSON.parse(JSONid)
    }
    else {
      return -1;
    }
  }
  //save the user data into the local storage//
  const saveuser = function (key, user) {
    localStorage.setItem(key, JSON.stringify(user))
  }

  //it is the function used to edit text of different paras and divs//
  const change_content = function (id, text) {
    const get_current_date = document.getElementById(id)
    get_current_date.innerHTML = ''
    get_current_date.innerHTML = text
  }


  if (localStorage.getItem('users') !== null) {
    user = getsaveduser();
  }
  else {
    saveuser('users', user)
  }

  //Function related to appendMovements//
  const appendMovement = function (type, date, value) {
    const movementsContainer = document.querySelector('.movements');

    const movementRow = document.createElement('div');
    movementRow.classList.add('movements__row');


    const typeElement = document.createElement('div');
    typeElement.classList.add('movements__type');
    if (type === 'deposit') {
      typeElement.classList.add('movements__type--deposit');
    }
    else {
      typeElement.classList.add('movements__type--withdrawal');
    }

    typeElement.textContent = type;

    const dateElement = document.createElement('div');
    dateElement.classList.add('movements__date');
    dateElement.textContent = date;

    const valueElement = document.createElement('div');
    valueElement.classList.add('movements__value');
    valueElement.textContent = `${value}€`;


    movementRow.appendChild(typeElement);
    movementRow.appendChild(dateElement);
    movementRow.appendChild(valueElement);


    movementsContainer.appendChild(movementRow);
  };


  //login..//
  const login_form = document.querySelector('.login')
  if (login_form) {
    login_form.addEventListener('submit', function (e) {
      e.preventDefault();
      const passwordError = document.querySelector('.password-error');
      if (passwordError) {
        passwordError.remove();
      }
      let flag = 0
      let ind = -1
      user.forEach(function (item, index) {
        if (e.target.elements.username.value.toLowerCase() === item.username.toLowerCase()) {
          flag = 1
          ind = index
          saveuser('id', index)
        }
      })
      if (flag === 1) {
        let pin = JSON.stringify(user[ind].pin)
        if (e.target.elements.userpin.value === pin) {
          //remove the opcaity//
          container1 = document.getElementById('container');
          container1.classList.remove('opaque');
          container2 = document.getElementById('intro');
          container2.classList.remove('opaque');
        }
      }
      e.target.elements.username.value = '';
      e.target.elements.userpin.value = '';
      id = getsavedid()

      change_content('deposit', `${user[id].deposited_amount}€`)
      change_content('current_date', `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`)
      change_content('intro_heading', `Welcome to the Bankist, ${user[id].username}`)
      const outvalue = calculate_Out()
      const interestvalue = calculate_Interest()
      //display summary//
      change_content('summary__value--in', `${user[id].deposited_amount}€`)
      change_content('summary__value--out', `${outvalue}€`)
      change_content('summary__value--interest', `${interestvalue}€`)
      //timer function//
      function taskAfterTimer() {
        container1.classList.add('opaque');
        container2.classList.add('opaque');
      }
      ///automatically logout timer..///
      const timer = setTimeout(taskAfterTimer, 120000);
      
      user[id].movement.forEach(function (item, index) {
        appendMovement('1WithDraw', `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, `${item.transfer_amount}`)
      })
      user[id].loan.forEach(function (item, index) {
        appendMovement('1Deposit', `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, `${item.loan_amount}`)
      })

    })
  }




  //Money transfer Operation..//
  const transfer_operation = document.querySelector('.form--transfer')
  if (transfer_operation) {
    transfer_operation.addEventListener('submit', function (e) {
      e.preventDefault()
      if (e.target.elements.transfer_to.value !== '' && e.target.elements.transfer_amount !== null) {
        user[id].deposited_amount = user[id].deposited_amount - e.target.elements.transfer_amount.value
        user[id].movement.push({
          transfer_to: e.target.elements.transfer_to.value,
          transfer_amount: e.target.elements.transfer_amount.value
        })
        saveuser('users', user)
        change_content('deposit', `${user[id].deposited_amount}€`)
        const outvalue = calculate_Out()
        const interestvalue = calculate_Interest()
        //display summary//
        change_content('summary__value--in', `${user[id].deposited_amount}€`)
        change_content('summary__value--out', `${outvalue}€`)
        change_content('summary__value--interest', `${interestvalue}€`)
        //display movements//
        appendMovement('1WithDraw', `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, `${e.target.elements.transfer_amount.value}`)
      }
      e.target.elements.transfer_to.value = '';
      e.target.elements.transfer_amount.value = '';
    })
  }

  //Loan Request Operation..//
  const loan_operation = document.querySelector('.form--loan')
  if (loan_operation) {
    loan_operation.addEventListener('submit', function (e) {
      e.preventDefault()
      document.querySelector('#abc').innerHTML = ''
      if (e.target.elements.loan.value !== '') {
        let ten_percent = (10 / 100) * e.target.elements.loan.value
        if (user[id].deposited_amount > ten_percent) {
          let a = parseInt(user[id].deposited_amount)
          let b = parseInt(e.target.elements.loan.value)
          a = a + b
          user[id].deposited_amount = a
          user[id].loan.push({
            apply_at: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`,
            loan_amount: e.target.elements.loan.value
          })
          saveuser('users', user)
          change_content('deposit', `${user[id].deposited_amount}€`)
          const outvalue = calculate_Out()
          const interestvalue = calculate_Interest()
          //display summary//
          change_content('summary__value--in', `${user[id].deposited_amount}€`)
          change_content('summary__value--out', `${outvalue}€`)
          change_content('summary__value--interest', `${interestvalue}€`)
          //display movements//
          appendMovement('1Deposit', `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, `${e.target.elements.loan.value}`)
          e.target.elements.loan.value = ''
        }
        else {
          const get_current_date = document.getElementById('abc')
          get_current_date.innerHTML = `sorry you cannot apply that amount for loan`
          e.target.elements.loan.value = ''
        }
      }
    })
  }


  //logout user operation..//
  const logout = document.querySelector('.form--close')
  if (logout) {
    logout.addEventListener('submit', function (e) {
      e.preventDefault()
      let pin = JSON.stringify(user[id].pin)
      if (user[id].username.toLowerCase() === e.target.elements.username.value.toLowerCase() && pin === e.target.elements.passpin.value) {
        console.log('abc')
        user.splice(id, 1)
        saveuser('users', user)
        container1.classList.add('opaque');
        container2.classList.add('opaque');
      }
      e.target.elements.username.value = ''
      e.target.elements.passpin.value = ''
    })
  }
})

