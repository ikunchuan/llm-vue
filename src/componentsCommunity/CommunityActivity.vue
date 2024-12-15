<template>
    <div>
        <h1>ChatGPT Stream</h1>
        <input v-model="userInput" placeholder="Enter your message" />
        <button @click="sendMessage">Send</button>
        <!-- 将所有文本保存在一个div容器中 -->
        <div class="messages-container">
            {{ fullMessage }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInput: '',
            fullMessage: '',  // 用于保存整个文本
            eventSource: null,
        };
    },
    methods: {
        sendMessage() {
            if (this.eventSource) {
                this.eventSource.close();
            }
            this.eventSource = new EventSource(`http://localhost:10086/chat/stream?message=${encodeURIComponent(this.userInput)}`);

            this.eventSource.onmessage = (event) => {
                this.fullMessage += event.data;  // 不断将新的数据添加到fullMessage中
            };

            this.eventSource.onerror = () => {
                console.error('Error occurred');
                this.eventSource.close();
            };
        },
    },
    beforeUnmount() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    },
};
</script>

<style>
/* 限制文本容器的最大宽度，文本会自动换行 */
.messages-container {
    max-width: 600px;   /* 设置容器的最大宽度 */
    word-wrap: break-word;  /* 确保文本在需要时换行 */
    white-space: pre-wrap;  /* 保留文本的换行符 */
    margin-top: 20px;
}
</style>