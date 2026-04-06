let currentUser = null;

async function register() {
  let login = document.getElementById("login").value;
  let password = document.getElementById("password").value;

  await fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({login, password})
  });

  alert("Registered!");
}

async function loginUser() {
  let login = document.getElementById("login").value;
  let password = document.getElementById("password").value;

  let res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({login, password})
  });

  let data = await res.json();

  if (data.error) return alert("Xato");

  currentUser = login;
  document.getElementById("auth").style.display = "none";
  document.getElementById("game").style.display = "block";

  update();
}

async function update() {
  let res = await fetch("/user?login=" + currentUser);
  let data = await res.json();

  document.getElementById("user").innerText = currentUser;
  document.getElementById("balance").innerText = "Balans: " + data.balance;
  document.getElementById("uc").innerText = "UC: " + data.uc;
}

async function play() {
  let res = await fetch("/play", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({login: currentUser})
  });

  let data = await res.json();

  document.getElementById("result").innerText = data.message;
  update();
}

async function getReward() {
  let id = prompt("PUBG ID yoz:");

  let res = await fetch("/reward", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({login: currentUser, id})
  });

  let data = await res.json();
  alert(data.message);
}

async function admin() {
  let pass = prompt("Admin parol:");

  if (pass !== "@dilmurod@98") return alert("Xato");

  let user = prompt("Login:");
  let amount = prompt("Pul:");

  await fetch("/add", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({user, amount})
  });

  alert("Qo‘shildi");
}
