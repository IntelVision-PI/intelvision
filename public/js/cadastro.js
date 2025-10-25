const view_password = document.getElementById("view_password");
const view_password_retype = document.getElementById("view_password_retype");
const password_input = document.getElementById("password");
const password_retype_input = document.getElementById("password_retype");
const tipo_usuario_input = document.getElementById("tipoUsuario");

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const upper_alphabetic = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const lower_alphabetic = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const eight_characters = document.getElementById("eight_characters");
const has_number = document.getElementById("has_number");
const has_upper_lower_char = document.getElementById("has_upper_lower_char");

view_password.addEventListener("click", () => {
  if (
    view_password.parentElement.getElementsByTagName("input")[0].type ==
    "password"
  ) {
    view_password.parentElement.getElementsByTagName("input")[0].type = "text";
    view_password.innerText = "visibility_off";
  } else {
    view_password.parentElement.getElementsByTagName("input")[0].type =
      "password";
    view_password.innerText = "visibility";
  }
});

view_password_retype.addEventListener("click", () => {
  if (
    view_password_retype.parentElement.getElementsByTagName("input")[0].type ==
    "password"
  ) {
    view_password_retype.parentElement.getElementsByTagName("input")[0].type =
      "text";
    view_password_retype.innerText = "visibility_off";
  } else {
    view_password_retype.parentElement.getElementsByTagName("input")[0].type =
      "password";
    view_password_retype.innerText = "visibility";
  }
});

function verifyPassword(type = "default") {
  let valid = true;

  if (password_input.value.length >= 8) {
    eight_characters.style.color = "#00863F";
  } else {
    if (type == "default")
      eight_characters.style.color = "rgba(43, 43, 43, 0.4)";
    else eight_characters.style.color = "rgba(255, 0, 0, 0.4)";
    valid = false;
  }

  let has_number_input = false;
  let has_lower_input = false;
  let has_upper_input = false;
  for (let i = 0; i < password_input.value.length; i++) {
    if (numbers.includes(password_input.value[i])) {
      has_number_input = true;
    }
    if (lower_alphabetic.includes(password_input.value[i])) {
      has_lower_input = true;
    }
    if (upper_alphabetic.includes(password_input.value[i])) {
      has_upper_input = true;
    }
  }

  if (has_number_input) {
    has_number.style.color = "#00863F";
  } else {
    if (type == "default") has_number.style.color = "rgba(43, 43, 43, 0.4)";
    else has_number.style.color = "rgba(255, 0, 0, 0.4)";
    valid = false;
  }

  if (has_lower_input && has_upper_input) {
    has_upper_lower_char.style.color = "#00863F";
  } else {
    if (type == "default")
      has_upper_lower_char.style.color = "rgba(43, 43, 43, 0.4)";
    else has_upper_lower_char.style.color = "rgba(255, 0, 0, 0.4)";
    valid = false;
  }

  if (password_input.value != password_retype_input.value) {
    valid = false;
    password_retype_input.style.borderColor = "rgba(255, 0, 0, 0.4)";
  } else {
    password_retype_input.style.borderColor = "#00863F";
  }

  return valid;
}

password_input.addEventListener("keyup", () => {
  verifyPassword();
});
password_retype_input.addEventListener("keyup", () => {
  verifyPassword();
});

const submitCadastroButton = document.getElementById("submit_cadastro");

// inputs
const name = document.getElementById("name");
const email = document.getElementById("email");
const code = document.getElementById("code");

submitCadastroButton.addEventListener("click", () => {
  if (verifyPassword((type = "submit"))) {
    if (verifyFields([name, email, code])) {
      fetch("/usuarios/cadastrarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name.value,
          email: email.value,
          senha: password_input.value,
          codigoAtivacao: code.value,
          tipoUsuario: tipo_usuario_input.value,
        }),
      }).then((response) => {
        if (response.status == 403) {
          code.insertAdjacentHTML(
            "afterend",
            '<span style="color: #f00; text-align: center; font-size: 12px">Código inválido</span>'
          );
        } else {
          alert("Usuário criado com sucesso! Voltando para tela de login...");
          window.location.href = "login.html";
        }
      });
    }
  }
});
