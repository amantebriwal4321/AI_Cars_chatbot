const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const emptyState = document.getElementById('empty-state');
const imageUpload = document.getElementById('image-upload');
const uploadBtnLabel = document.getElementById('upload-btn-label');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');
const exampleBtns = document.querySelectorAll('.example-btn');

let currentImageFile = null;
let chatHistory = []; 

marked.setOptions({
    breaks: true,
    gfm: true
});

function updateSendButton() {
    const text = messageInput.value.trim();
    if (text || currentImageFile) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    updateSendButton();
});

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        messageInput.value = btn.innerText;
        updateSendButton();
        sendMessage();
    });
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        addMessage('bot', 'Please upload a JPEG, PNG, or WEBP image.');
        imageUpload.value = '';
        return;
    }
    if (file.size > 4 * 1024 * 1024) { 
        addMessage('bot', 'Image is too large. Max size is 4MB.');
        imageUpload.value = '';
        return;
    }

    currentImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove('hidden');
        updateSendButton();
    };
    reader.readAsDataURL(file);
});

removeImageBtn.addEventListener('click', () => {
    currentImageFile = null;
    imageUpload.value = '';
    imagePreviewContainer.classList.add('hidden');
    imagePreview.src = '';
    updateSendButton();
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function addMessage(role, content, isHtml = false, imageUrl = null) {
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    let innerContent = '';
    if (imageUrl) {
        innerContent += `<img src="${imageUrl}" alt="User uploaded image"><br>`;
    }
    
    if (isHtml) {
        innerContent += `<div class="message-content">${content}</div>`;
    } else {
        innerContent += `<div class="message-content">${escapeHtml(content)}</div>`;
    }
    
    msgDiv.innerHTML = innerContent;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text && !currentImageFile) return;

    const hasImage = !!currentImageFile;
    const currentText = text;
    const imageFileToUpload = currentImageFile;
    let previewUrl = null;
    
    if (hasImage) {
        previewUrl = imagePreview.src;
        removeImageBtn.click();
    }
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    updateSendButton();

    addMessage('user', currentText || 'Uploaded an image', false, previewUrl);

    messageInput.disabled = true;
    sendBtn.disabled = true;
    uploadBtnLabel.classList.add('disabled');

    try {
        let response;
        if (hasImage) {
            const formData = new FormData();
            formData.append('image', imageFileToUpload);
            if (currentText) {
                formData.append('prompt', currentText);
            }
            
            response = await fetchWithRetry('/vision', {
                method: 'POST',
                body: formData
            });
        } else {
            chatHistory.push({ role: 'user', content: currentText });
            
            response = await fetchWithRetry('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: currentText, history: chatHistory.slice(0, -1) })
            });
        }

        const data = await response.json();

        if (!response.ok) {
            handleApiError(response.status, data);
        } else {
            const htmlContent = marked.parse(data.reply);
            addMessage('bot', htmlContent, true);
            if (!hasImage) {
                chatHistory.push({ role: 'model', content: data.reply });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('bot', 'Something went wrong, please retry.');
    } finally {
        messageInput.disabled = false;
        sendBtn.disabled = false;
        uploadBtnLabel.classList.remove('disabled');
        messageInput.focus();
        updateSendButton();
    }
}

async function fetchWithRetry(url, options, retries = 1) {
    try {
        const res = await fetch(url, options);
        if (res.status === 429 && retries > 0) {
            console.log('Rate limited. Retrying in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchWithRetry(url, options, retries - 1);
        }
        return res;
    } catch (err) {
        throw err;
    }
}

function handleApiError(status, data) {
    if (status === 429) {
        addMessage('bot', 'I am currently busy, please try again in a moment.');
    } else if (status === 403 || data.error?.includes('PermissionDenied') || data.error?.includes('API key')) {
        addMessage('bot', `**API Error:** ${data.error || 'API key invalid or has no permissions'}`, true);
    } else {
        addMessage('bot', `**Error:** ${data.error || 'Something went wrong, please retry'}`, true);
    }
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
