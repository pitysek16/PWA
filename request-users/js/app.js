window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker register success", reg);
    } catch (error) {
      console.log("Service worker register fail");
    }
  }

  await loadPosts();
});

async function loadPosts() {
  const res = await fetch("https://reqres.in/api/users?page=2");
  const data = await res.json();

  const allUsers = data.data;
  console.log("🚀 ~ file: app.js ~ line 19 ~ loadPosts ~ allUsers", allUsers);

  const container = document.querySelector("#users");
  container.innerHTML = allUsers.map(toCard).join("\n");
}

function toCard(post) {
  return `
    <div class="card">
    <div class="card-img">
      <img src=" ${post.avatar}" alt=" ${post.first_name}  ${post.last_name}">
    </div>
    <div>
      <div class="card-title">
        ${post.first_name}  ${post.last_name}
      </div>
      <div class="card-body">
        email: ${post.email}
      </div>
      </div>
    </div>
  `;
}
