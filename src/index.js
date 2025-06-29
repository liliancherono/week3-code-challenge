const API = 'http://localhost:3000/posts';

function displayPosts() {
  fetch(API)
    .then(res => res.json())
    .then(posts => {
      const list = document.querySelector('#post-list');
      list.innerHTML = '';
      posts.forEach(post => {
        const item = document.createElement('div');
        item.textContent = `${post.title}\n${post.author} • ${post.date}`;
        item.className = 'bg-white shadow px-3 py-2 rounded hover:bg-gray-100';
        item.addEventListener('click', () => handlePostClick(post));
        list.appendChild(item);
      });
      if (posts[0]) handlePostClick(posts[0]);
    });
}

function handlePostClick(post) {
  const detail = document.querySelector('#post-detail');
  detail.innerHTML = `
    <h2 class="text-2xl font-bold">${post.title}</h2>
    <p class="text-sm text-gray-500">By ${post.author} • ${post.date}</p>
    <img src="${post.image}" alt="${post.title}" class="my-4 rounded-md" />
    <p>${post.content}</p>
    <div class="mt-4 flex gap-2">
      <button id="edit-btn" class="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900">
         Edit
      </button>
      <button id="delete-btn" class="flex items-center gap-1 text-sm text-red-700 hover:text-red-900">
         Delete
      </button>
    </div>
  `;

  document.querySelector('#edit-btn').addEventListener('click', () => {
    document.querySelector('#edit-post-form').classList.remove('hidden');
    document.querySelector('#edit-title').value = post.title;
    document.querySelector('#edit-content').value = post.content;
    document.querySelector('#edit-post-form').onsubmit = function (e) {
      e.preventDefault();
      const updatedPost = {
        title: e.target.title.value,
        content: e.target.content.value
      };
      fetch(`${API}/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      })
        .then(res => res.json())
        .then(() => {
          displayPosts();
          document.querySelector('#edit-post-form').classList.add('hidden');
        });
    };
  });

  document.querySelector('#delete-btn').addEventListener('click', () => {
    fetch(`${API}/${post.id}`, { method: 'DELETE' })
      .then(() => displayPosts());
  });
}

function addNewPostListener() {
  document.querySelector('#new-post-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const newPost = {
      title: form.title.value,
      author: form.author.value,
      date: new Date().toISOString().split('T')[0],
      content: form.content.value,
      image: form.image.value
    };
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });

  document.querySelector('#cancel-edit').addEventListener('click', () => {
    document.querySelector('#edit-post-form').classList.add('hidden');
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);