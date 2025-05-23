(function() {
    // Helper function to get the current MBTI type from the page URL or a data attribute
    function getCurrentMbtiType() {
        // Option 1: Infer from URL (e.g., /pages/infj.html -> infj)
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const mbtiType = filename.replace('.html', '').toUpperCase();
        // Basic validation if it's one of the 16 types, otherwise return null or a default
        const validTypes = ["INFJ", "INTJ", "INFP", "INTP", "ISFJ", "ISTJ", "ISFP", "ISTP", "ENFJ", "ENTJ", "ENFP", "ENTP", "ESFJ", "ESTJ", "ESFP", "ESTP"];
        if (validTypes.includes(mbtiType)) {
            return mbtiType;
        }
        // Option 2: Read from a data attribute if set on the body or a main element
        // return document.body.dataset.mbtiType; 
        return null; // Fallback
    }

    const mbtiType = getCurrentMbtiType();
    const commentInputElementId = 'comment-input'; // Assuming common ID for now
    const commentSubmitButtonElementId = 'comment-submit-btn';
    const commentsListElementId = 'comments-list';

    // Function to save a comment
    function saveComment(commentText) {
        if (!mbtiType || !commentText.trim()) return;

        const comment = {
            text: commentText.trim(),
            timestamp: new Date().toISOString()
        };

        let comments = JSON.parse(localStorage.getItem(mbtiType + '_comments')) || [];
        comments.push(comment);
        localStorage.setItem(mbtiType + '_comments', JSON.stringify(comments));
    }

    // Function to render comments
    function renderComments() {
        if (!mbtiType) return;

        const commentsList = document.getElementById(commentsListElementId);
        if (!commentsList) return;

        commentsList.innerHTML = ''; // Clear existing comments

        const storedComments = JSON.parse(localStorage.getItem(mbtiType + '_comments')) || [];

        if (storedComments.length === 0) {
            // Ensure the placeholder class is defined in CSS
            commentsList.innerHTML = '<p class="placeholder-text">아직 댓글이 없습니다.</p>';
            return;
        }

        storedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Show newest first

        storedComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item'; // For styling

            const commentTextP = document.createElement('p');
            commentTextP.textContent = comment.text;

            const commentTimestampSpan = document.createElement('span');
            commentTimestampSpan.className = 'comment-timestamp';
            commentTimestampSpan.textContent = new Date(comment.timestamp).toLocaleString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            commentItem.appendChild(commentTextP);
            commentItem.appendChild(commentTimestampSpan);
            commentsList.appendChild(commentItem);
        });
    }

    // Initialize and set up event listeners when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        if (!mbtiType) {
            console.warn('MBTI type not identified for this page. Comments disabled.');
            return;
        }

        const commentInput = document.getElementById(commentInputElementId);
        const submitButton = document.getElementById(commentSubmitButtonElementId);

        if (commentInput && submitButton) {
            submitButton.addEventListener('click', function() {
                const commentText = commentInput.value;
                if (commentText) {
                    saveComment(commentText);
                    renderComments(); // Re-render comments to show the new one
                    commentInput.value = ''; // Clear input field
                }
            });
        } else {
            console.warn('Comment input or submit button not found on this page.');
        }

        // Initial render of comments on page load
        renderComments();
    });

})();
