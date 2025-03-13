class VideoComments extends HTMLElement { 
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.comments = [];
        this.loadComments();
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .comments-container {
                    max-width: 600px;
                    margin: 0 auto 20px auto;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                }
                slot[name="header"] {
                    font-size: 20px;
                    color: #007bff;
                }
                .comment-list {
                    margin-bottom: 20px;
                }
                .comment {
                    border-bottom: 1px solid #eee;
                    padding: 10px 0;
                }
                .comment-name {
                    font-weight: bold;
                    color: #333;
                }
                .comment-text {
                    margin: 5px 0;
                }
                .comment-form {
                    display: grid;
                    grid-template-columns: 1fr 3fr;
                    gap: 10px;
                    align-items: start;
                }
                .comment-form label {
                    text-align: left;
                    font-weight: bold;
                }
                .comment-form input, 
                .comment-form textarea {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 1px solid #ddd;
                }
                .comment-form textarea {
                    grid-column: 2 / 3;
                    min-height: 80px;
                    resize: vertical;
                }
                .comment-form button {
                    grid-column: 2 / 3;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                .comment-form button:hover {
                    background-color: #0056b3;
                }
            </style>
            <template id="comment-template">
                <div class="comment">
                    <span class="comment-name"></span>
                    <p class="comment-text"></p>
                </div>
            </template>
            <div class="comments-container">
                <slot name="header"></slot>
                <div class="comment-list"></div>
                <form class="comment-form">
                    <label for="name">Имя:</label>
                    <input type="text" id="name" placeholder="Ваше имя" required>
                    <label for="text">Комментарий:</label>
                    <textarea id="text" placeholder="Ваш комментарий" required></textarea>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        `;

        const template = this.shadowRoot.querySelector('#comment-template');
        const commentList = this.comments.map(comment => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.comment-name').textContent = comment.name;
            clone.querySelector('.comment-text').textContent = comment.text;
            return clone;
        });

        const commentListContainer = this.shadowRoot.querySelector('.comment-list');
        commentList.forEach(commentNode => commentListContainer.appendChild(commentNode));

        this.shadowRoot.querySelector('.comment-form').addEventListener('submit', this.submit.bind(this));
        this.updateCommentCount();
    }

    submit(event) {
        event.preventDefault();
        const nameInput = this.shadowRoot.querySelector('#name');
        const textInput = this.shadowRoot.querySelector('#text');
        const newComment = {
            id: this.comments.length + 1,
            name: nameInput.value.trim(),
            text: textInput.value.trim()
        };
        if (newComment.name && newComment.text) { 
            this.comments.push(newComment);
            nameInput.value = '';
            textInput.value = '';
            this.saveComments();
            this.render();
        }
    }

    saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }

    loadComments() {
        const savedComments = localStorage.getItem('comments');
        if (savedComments) {
            this.comments = JSON.parse(savedComments);
        }
    }

    updateCommentCount() {
        const slot = this.shadowRoot.querySelector('slot[name="header"]');
        const assignedNodes = slot.assignedNodes();
        const countSpan = assignedNodes[0].querySelector('#comment-count');
        if (countSpan) {
            countSpan.textContent = this.comments.length;
        }
    }
}

customElements.define('video-comments', VideoComments);