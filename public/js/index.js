const containerList = document.querySelector('.container');
const containerEdit = document.querySelector('.container-edit');
const containerRegister = document.querySelector('.container-register');

const URL_API = 'http://localhost:8080/api/users';

const App = {
  
  async init() {
    const users = await App.getUsers();

    containerList.innerHTML = "";

    users.forEach(user => {
      App.addUsersHTML(user);
    });

    App.addEventsButtons();
  },

  async getUsers() {
    const { users } = await fetch(URL_API).then(response => response.json());

    return users;
  },

  activeButton(event) {
    const btnList = document.querySelector("#btnList");
    const btnRegister = document.querySelector("#btnRegister");

    btnList.classList.remove('active');
    btnRegister.classList.remove('active');
    
    event.target.classList.add('active');

    if (event.target.id === 'btnRegister') {
      containerList.classList.remove('active');
      containerRegister.classList.add('active');
    } else if (event.target.id === 'btnList') {
      containerList.classList.add('active');
      containerRegister.classList.remove('active');
    }
  },

  addEventsButtons() {
    const btnList = document.querySelector("#btnList");
    const btnRegister = document.querySelector("#btnRegister");

    btnList.addEventListener('click', App.activeButton);
    btnRegister.addEventListener('click', App.activeButton);

    const buttonEdit = document.querySelectorAll("#edit");
    const buttonsDel = document.querySelectorAll("#del");

    buttonEdit.forEach(button => {
      button.addEventListener('click', App.renderFormEdit);
    });

    buttonsDel.forEach(button => {
      button.addEventListener('click', App.deleteUser);
    });

    const buttonRegister = document.querySelector("#btn-register");
    buttonRegister.addEventListener('click', App.addUser);
  },

  addUsersHTML({ _id, name, email, age, photo, description }) {
    
    const HTML = `
        <div class="user">
          <div class="buttons-actions">
            <button type="button" id="edit" title="Editar usuário" href="#" >
              <img data-id="${_id}" src="/public/assets/edit.svg" alt="Editar usuário" />
            </button>
            <button type="button" id="del" title="Remover usuário" href="#" >
              <img data-id="${_id}" src="/public/assets/remove.svg" alt="Remover usuário" />
            </button>
          </div>

          <div class="img">
            <img src="${photo}" alt="Foto de ${name}" />
          </div>

          <div class="info">
            <h2>${name}</h2>

            <p>
              Email: <span>${email}</span>
            </p>
            <p>
              Idade: <span>${age}</span>
            </p>
          </div>

          <div class="description">
            <p>
              ${description}
            </p>
          </div>
        </div>
    `;

    containerList.innerHTML += HTML;
  },

  async addUser(event) {
    event.preventDefault();

    const form = document.forms["formRegister"];

    const name = document.forms["formRegister"].name.value;
    const email = document.forms["formRegister"].email.value;
    const password = document.forms["formRegister"].password.value;
    const age = document.forms["formRegister"].age.value;
    const description = document.forms["formRegister"].description.value;
    const photo = document.forms["formRegister"].photo.value;password;

    fetch(`${URL_API}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ 
        name,
        age,
        email,
        password, 
        description,
        photo
      })
    }).then(response => {
      response.json().then(data => {
        if (data.message === 'sucess') {
          alert('Cadastro realizado com sucesso');
          form.reset();
          App.init();
          containerRegister.classList.remove('active');
          containerList.classList.add('active');
        } else {
          alert('Ops ocorreu um erro tente novamente!');
        }
      })
    });
  },

  async editUser(event) {
    const form = document.forms["formEdit"];
    const id = event.target.dataset.id;

    const name = document.forms["formEdit"].name.value;
    const email = document.forms["formEdit"].email.value;
    const age = document.forms["formEdit"].age.value;
    const description = document.forms["formEdit"].description.value;
    const photo = document.forms["formEdit"].photo.value;

    fetch(`${URL_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        age,
        email,
        description,
        photo
      })
    }).then(response => {
      response.json().then(data => {
        if (data.message === 'sucess') {
          alert('Usuário alterado com sucesso!');
          App.init();
          form.reset();
          containerEdit.classList.remove('active');
          containerList.classList.add('active');
        }
      })
    })
  },

  async renderFormEdit(event) {
    const userID = event.target.dataset.id;
    const data = await fetch(`${URL_API}/${userID}`).then(response => response.json());
    const { name, age, email, description, photo } = data.users[0];

    const form = document.forms["formEdit"];
    
    const HTML = `
      <div>
        <label>Nome</label>
        <input type="text" name="name" value="${name}" />
      </div>

      <div>
        <label>Email</label>
        <input type="text" name="email" value="${email}" />
      </div>

      <div>
        <label>Idade</label>
        <input type="text" name="age" value="${age}" />
      </div>

      <div>
        <label>Foto</label>
        <input type="text" name="photo" value="${photo}" placeholder="link de sua foto" />
      </div>

      <div>
        <label>Descrição</label>
        <p>
          ${description}
        </p>
        <textarea name="description" maxlength="235" placeholder="Altere sua descrição aqui"></textarea>
      </div>

      <button id="button-edit" type="button">
        Editar
      </button>
    `;

    form.innerHTML = HTML;

    const button = document.querySelector('#button-edit');
    button.dataset.id = userID;
    button.addEventListener('click', App.editUser);

    containerEdit.classList.add('active');
    containerList.classList.remove('active');
  },

  deleteUser(event) {
    const userID = event.target.dataset.id;

    fetch(`${URL_API}/${userID}`, {
      method: 'DELETE'
    }).then(response => {
      response.json().then(data => {
        if (data.message === 'sucess') {
          alert('Usuário removido com sucesso!');
          App.init();
        } else {
          alert('Ops ocorreu um erro tente novamente!');
        }
      })
    });
  }
}

App.init();