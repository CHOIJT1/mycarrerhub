// 간단한 비밀번호
const PASSWORD = "1234";

function login() {
  const input = document.getElementById("admin-password").value;
  if (input === PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadProjects();
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
}

function addProject() {
  const title = document.getElementById("project-title").value;
  const desc = document.getElementById("project-desc").value;

  if (!title || !desc) {
    alert("모든 필드를 입력하세요.");
    return;
  }

  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  projects.push({ title, desc });
  localStorage.setItem("projects", JSON.stringify(projects));

  document.getElementById("project-title").value = "";
  document.getElementById("project-desc").value = "";

  loadProjects();
}

function loadProjects() {
  const list = document.getElementById("project-list");
  list.innerHTML = "";
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  projects.forEach((p, idx) => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - ${p.desc}`;
    list.appendChild(li);
  });
}

function uploadResume() {
  const fileInput = document.getElementById("resume-upload");
  const file = fileInput.files[0];
  if (!file) {
    alert("파일을 선택하세요.");
    return;
  }

  // 실제 파일 업로드는 로컬 환경에서는 불가능하므로 안내
  alert("GitHub Pages에서는 파일 업로드가 동작하지 않습니다. resume.pdf를 수동으로 덮어써주세요.");
}