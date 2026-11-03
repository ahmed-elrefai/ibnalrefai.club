(() => {
    const widget = document.querySelector('[data-blog-post]');
    if (!widget) return;

    const slug = widget.dataset.postSlug;
    const viewCount = widget.querySelector('[data-view-count]');
    const viewStatus = widget.querySelector('[data-view-status]');
    const likeButton = widget.querySelector('[data-like-button]');
    const likeCount = widget.querySelector('[data-like-count]');
    const likeLabel = widget.querySelector('[data-like-label]');
    const likeStatus = widget.querySelector('[data-like-status]');
    const isArabic = document.documentElement.lang === 'ar';

    const recordView = () => {
        fetch(`/api/blogs/${encodeURIComponent(slug)}/view`, {
            method: 'POST',
            credentials: 'same-origin',
            keepalive: true
        })
            .then(async (response) => {
                const body = await response.text();
                let result;
                try {
                    result = JSON.parse(body);
                } catch {
                    if (response.ok) throw new Error('Invalid response from the server.');
                }
                if (!response.ok) {
                    throw new Error(result?.detail || 'Could not record this view.');
                }
                return result;
            })
            .then((result) => {
                viewCount.textContent = result.views.toLocaleString();
            })
            .catch((error) => {
                viewStatus.textContent = error.message || (isArabic
                    ? 'تعذر تحديث عدد المشاهدات.'
                    : 'Could not update the view count.');
            });
    };

    if (document.visibilityState === 'visible') {
        recordView();
    } else {
        const recordWhenVisible = () => {
            if (document.visibilityState !== 'visible') return;
            document.removeEventListener('visibilitychange', recordWhenVisible);
            recordView();
        };
        document.addEventListener('visibilitychange', recordWhenVisible);
    }

    likeButton.addEventListener('click', async () => {
        const wasLiked = likeButton.getAttribute('aria-pressed') === 'true';
        likeButton.disabled = true;
        likeStatus.textContent = '';
        try {
            const response = await fetch(
                `/api/blogs/${encodeURIComponent(slug)}/like`,
                {
                    method: wasLiked ? 'DELETE' : 'PUT',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) throw new Error('Could not update this like.');
            const result = await response.json();
            likeButton.setAttribute('aria-pressed', String(result.liked));
            likeButton.classList.toggle('is-liked', result.liked);
            likeLabel.textContent = result.liked
                ? likeButton.dataset.labelUnlike
                : likeButton.dataset.labelLike;
            likeCount.textContent = result.likes.toLocaleString();
        } catch {
            likeStatus.textContent = isArabic
                ? 'تعذر تحديث الإعجاب. حاول مرة أخرى.'
                : 'Could not update your like. Please try again.';
        } finally {
            likeButton.disabled = false;
        }
    });
})();
