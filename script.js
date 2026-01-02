const correctPassword = "1234";

const defaultSubjects = [
  "Geotech",
  "Structural",
  "Environmental",
  "Transportation",
  "MA-203"
];

if (!localStorage.getItem("subjects")) {
  localStorage.setItem("subjects", JSON.stringify(defaultSubjects));
}

const loginContainer = document.getElementById("login-container");
const attendanceContainer = document.getElementById("attendance-container");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const themeToggle = document.getElementById("theme-toggle");
const subjectSelect = document.getElementById("subject-select");
const subjectNameInput = document.getElementById("subject-name");
const addSubjectBtn = document.getElementById("add-subject-btn");
const attendanceSummary = document.getElementById("attendance-summary");
const subjectList = document.getElementById("subject-list");
const presentBtn = document.getElementById("present-btn");
const absentBtn = document.getElementById("absent-btn");
const errorMessage = document.getElementById("error-message");
const passwordInput = document.getElementById("password");

loginBtn.onclick = () => {
  if (passwordInput.value === correctPassword) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", "User");
    init();
  } else {
    errorMessage.style.display = "block";
  }
};

logoutBtn.onclick = () => {
  localStorage.clear();
  location.reload();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light");
};

presentBtn.onclick = () => markAttendance("present");
absentBtn.onclick = () => markAttendance("absent");

addSubjectBtn.onclick = () => {
  const name = subjectNameInput.value.trim();
  if (!name) return;
  const subjects = JSON.parse(localStorage.getItem("subjects"));
  subjects.push(name);
  localStorage.setItem("subjects", JSON.stringify(subjects));
  subjectNameInput.value = "";
  load();
};

function markAttendance(type) {
  const subject = subjectSelect.value;
  if (!subject) return alert("Select subject");
  const data = JSON.parse(localStorage.getItem("attendance")) || {};
  data[subject] ??= { present: 0, absent: 0 };
  data[subject][type]++;
  localStorage.setItem("attendance", JSON.stringify(data));
  load();
}

function load() {
  const subjects = JSON.parse(localStorage.getItem("subjects"));
  const data = JSON.parse(localStorage.getItem("attendance")) || {};

  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  attendanceSummary.innerHTML = "";
  subjectList.innerHTML = "";

  subjects.forEach(s => {
    subjectSelect.innerHTML += `<option>${s}</option>`;

    const p = data[s]?.present || 0;
    const a = data[s]?.absent || 0;
    const total = p + a;
    const percent = total ? Math.round((p / total) * 100) : 0;

    attendanceSummary.innerHTML += `
      <li>
        <b>${s}</b><br>
        P: ${p}, A: ${a} | <b>${percent}%</b>
      </li>
    `;

    const li = document.createElement("li");
    li.innerHTML = `${s} <button onclick="removeSubject('${s}')">❌</button>`;
    subjectList.appendChild(li);
  });
}

window.removeSubject = (s) => {
  let subjects = JSON.parse(localStorage.getItem("subjects"));
  subjects = subjects.filter(x => x !== s);
  localStorage.setItem("subjects", JSON.stringify(subjects));
  load();
};

function init() {
  loginContainer.classList.add("hidden");
  attendanceContainer.classList.remove("hidden");
  document.getElementById("user-name").innerText = "User";
  load();
}

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  if (localStorage.getItem("isLoggedIn")) init();
};
