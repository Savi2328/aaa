const API = "http://localhost:8000/api";

function getCookie(name) {
    const v = document.cookie.split("; ").find(row => row.startsWith(name + "="));
    return v ? decodeURIComponent(v.split("=")[1]) : null;
}

async function fetchJSON(path, opts = {}) {
    const res = await fetch(API + path, {
    ...opts,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
        },
    });

    if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
    }
    return res.status === 204 ? null : res.json();
}

async function ensureCsrf() {
    await fetch(API + "/csrf/", { credentials: "include" });
}

async function login() {
    await ensureCsrf();
    const csrf = getCookie("csrftoken");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetchJSON("/login/", {
        method: "POST",
        headers: {"X-CSRFToken":csrf},
        body:JSON.stringify({username, password}),
    });

    document.getElementById("authInfo").textContent = "Zalogowano ✅";
    await loadTasks();
}


async function logout(){
    await ensureCsrf();
    const csrf = getCookie("csrftoken");

    await fetchJSON("/logout/", {
        method: "POST",
        headers: {"X-CSRFToken": csrf},
    });

    document.getElementById("authInfo").textContent = "Wylogowano ✅";
    document.getElementById("list").innerHTML = '';
}

async function loadTasks() {
  const tasks = await fetchJSON("/tasks/");
  const list = document.getElementById("list");
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = (t.done ? "✅ " : "⬜ ") + t.title;

    li.onclick = async () => {
      await ensureCsrf();
      const csrf = getCookie("csrftoken");
      await fetchJSON(`/tasks/${t.id}/`, {
        method: "PATCH",
        headers: { "X-CSRFToken": csrf },
        body: JSON.stringify({ done: !t.done }),
      });
      await loadTasks();
    };

    list.appendChild(li);
  });
}

async function addTask() {
  await ensureCsrf();
  const csrf = getCookie("csrftoken");

  const title = document.getElementById("taskTitle").value.trim();
  if (!title) return;

  await fetchJSON("/tasks/", {
    method: "POST",
    headers: { "X-CSRFToken": csrf },
    body: JSON.stringify({ title }),
  });

  document.getElementById("taskTitle").value = "";
  await loadTasks();
}

document.getElementById("loginBtn").onclick = () => login().catch(e => alert(e));
document.getElementById("logoutBtn").onclick = () => logout().catch(e => alert(e));
document.getElementById("addBtn").onclick = () => addTask().catch(e => alert(e));