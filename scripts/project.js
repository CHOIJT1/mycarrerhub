// 프로젝트 데이터 예시
const projects = [
  {
    title: "포트폴리오 웹사이트",
    description: "개인 포트폴리오를 위한 반응형 웹사이트입니다.",
    tech: "HTML, CSS, JavaScript",
    link: "https://example.com/portfolio",
    image: "assets/images/portfolio.png"
  },
  {
    title: "이커머스 플랫폼",
    description: "온라인 쇼핑몰 기능을 갖춘 웹 애플리케이션입니다.",
    tech: "React, Node.js, MongoDB",
    link: "https://example.com/ecommerce",
    image: "assets/images/ecommerce.png"
  }
  // 추가 프로젝트 데이터를 여기에 삽입
];

// DOM 요소 선택
const projectGrid = document.querySelector(".project-grid");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTech = document.getElementById("modal-tech");
const modalLink = document.getElementById("modal-link");
const closeButton = document.querySelector(".close-button");

// 프로젝트 카드를 동적으로 생성
projects.forEach((project, index) => {
  const card = document.createElement("div");
  card.classList.add("project-card");
  card.innerHTML = `
    <img src="${project.image}" alt="${project.title}" />
    <div class="card-content">
      <h3>${project.title}</h3>
      <p>${project.tech}</p>
    </div>
  `;
  card.addEventListener("click", () => {
    showModal(project);
  });
  projectGrid.appendChild(card);
});

// 모달 표시 함수
function showModal(project) {
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalTech.textContent = project.tech;
  modalLink.href = project.link;
  modalLink.textContent = "프로젝트 링크";
  modal.classList.remove("hidden");
}

// 모달 닫기 이벤트
closeButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 모달 외부 클릭 시 닫기
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});
