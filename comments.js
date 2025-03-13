class VideoComments extends HTMLElement { // Изменено с Comments на VideoComments
    constructor() {
        super();
        console.log('Компонент VideoComments создан');
        this.attachShadow({ mode: 'open' });
        this.comments = [
            { id: 1, author: "Алексей", text: "Отличное видео!" },
            { id: 2, author: "Ольга", text: "Очень познавательно." }
        ];
        this.render();
    }

    render() {
        console.log('Рендеринг компонента');
        this.shadowRoot.innerHTML = `
            <style>
                .comments-container {
                    max-width: 600px;
                    margin: 0 auto 20px auto;
                    font-family: Arial, sans-serif;
                }
                .comment-list {
                    margin-bottom: 20px;
                }
                .comment {
                    border-bottom: 1px solid #eee;
                    padding: 10px 0;
                }
                .comment-author {
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
            <div class="comments-container">
                <div class="comment-list">
                    ${this.comments.map(comment => `
                        <div class="comment">
                            <span class="comment-author">${comment.author}</span>
                            <p class="comment-text">${comment.text}</p>
                        </div>
                    `).join('')}
                </div>
                <form class="comment-form">
                    <label for="author">Имя:</label>
                    <input type="text" id="author" placeholder="Ваше имя" required>
                    <label for="text">Комментарий:</label>
                    <textarea id="text" placeholder="Ваш комментарий" required></textarea>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        `;
        this.shadowRoot.querySelector('.comment-form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Форма отправлена');
        const authorInput = this.shadowRoot.querySelector('#author');
        const textInput = this.shadowRoot.querySelector('#text');
        const newComment = {
            id: this.comments.length + 1,
            author: authorInput.value.trim(),
            text: textInput.value.trim()
        };
        if (newComment.author && newComment.text) {
            this.comments.push(newComment);
            authorInput.value = '';
            textInput.value = '';
            this.render();
        }
    }
}

customElements.define('video-comments', VideoComments);