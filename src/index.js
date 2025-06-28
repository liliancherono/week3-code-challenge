document.addEventListener('DOMContentLoaded', main);

function main() {
  displayPosts();
  addNewPostListener();
  editPostListener();
}

// CORE: Fetch and display post titles
function displayPosts() {
  fetch('http://localhost:3000/posts')  // GET /posts
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    })
    .then(posts => {
      const list = document.getElementById('post-list');
      list.innerHTML = '';
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.textContent = post.title;
        postDiv.dataset.id = post.id;
        postDiv.classList.remove('selected'); // clear previous highlights

        postDiv.addEventListener('click', () => {
          handlePostClick(post.id);

          // Highlight the selected post
          document.querySelectorAll('#post-list div').forEach(div => div.classList.remove('selected'));
          postDiv.classList.add('selected');
        });

        list.appendChild(postDiv);
      });

      // Advanced: auto-load first post and highlight it
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
        list.querySelector('div').classList.add('selected');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error loading posts');
    });
}

// CORE: Display details of clicked post
function handlePostClick(id) {
  fetch(`http://localhost:3000/posts/${id}`)  // GET /posts/:id
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch post details');
      return res.json();
    })
    .then(post => renderPostDetail(post))
    .catch(error => {
      console.error(error);
      alert('Error loading post details');
    });
}

function renderPostDetail(post) {
  const detail = document.getElementById('post-detail');
  detail.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <p><em>By ${post.author}</em></p>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
  document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
}

// CORE: Add new post
function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('new-title').value,
      content: document.getElementById('new-content').value,
      author: document.getElementById('new-author').value
    };

    fetch('http://localhost:3000/posts', {  // POST /posts
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    })
    .then(() => {
      form.reset();
      displayPosts();
    })
    .catch(error => {
      console.error(error);
      alert('Error creating new post');
    });
  });
}

// ADVANCED: Show and populate edit form
function showEditForm(post) {
  const form = document.getElementById('edit-post-form');
  form.classList.remove('hidden');
  form.dataset.id = post.id;
  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;
}

// ADVANCED: Submit edited post
function editPostListener() {
  const form = document.getElementById('edit-post-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const id = form.dataset.id;
    const updatedPost = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(`http://localhost:3000/posts/${id}`, {  // PATCH /posts/:id
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    })
    .then(post => {
      form.classList.add('hidden');
      renderPostDetail(post);
      displayPosts();
    })
    .catch(error => {
      console.error(error);
      alert('Error updating post');
    });
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    form.classList.add('hidden');
  });
}

// ADVANCED: Delete a post
function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, {  // DELETE /posts/:id
    method: 'DELETE'
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to delete post');
    document.getElementById('post-detail').innerHTML = '<p>Select a post to see details</p>';
    displayPosts();
  })
  .catch(error => {
    console.error(error);
    alert('Error deleting post');
  });
}
