import { Conversation } from 'https://cdn.jsdelivr.net/npm/@elevenlabs/client/+esm';
(function () {
    const recentKey = 'sanskritisetu-recent-explorations';
    const ELEVENLABS_AGENT_ID = 'agent_0501m25x7zpqenc9x04zad4d4ff3'; // <--- Paste your Agent ID here

    // ... [keep getRecentExplorations, saveRecentExploration, renderRecentExplorations, setupGuidePrompts as they are] ...

    function setupVoiceInput() {
        const button = document.getElementById('voiceInputBtn');
        const input = document.getElementById('userInput');

        if (!button) return;

        let conversation = null;
        let isConnected = false;

        button.addEventListener('click', async () => {
            // Case 1: End active conversation if clicked again
            if (isConnected && conversation) {
                await conversation.endSession();
                return;
            }

            // Case 2: Start new ElevenLabs conversation
            try {
                // Ensure ElevenLabs SDK is loaded
                

                button.classList.add('listening');
                button.setAttribute('aria-label', 'Connecting to Voice Agent...');

                // Initialize Conversation Session
                conversation = await Conversation.startSession({
                    agentId: ELEVENLABS_AGENT_ID,
                    onConnect: () => {
                        isConnected = true;
                        button.setAttribute('aria-label', 'Listening... Click to stop');
                    },
                    onDisconnect: () => {
                        isConnected = false;
                        button.classList.remove('listening');
                        button.setAttribute('aria-label', 'Ask by voice');
                    },
                    onMessage: (message) => {
                        // Optional: Write spoken transcript into the text input box
                        if (message.source === 'user' && input) {
                            input.value = message.message;
                        }
                    },
                    onError: (error) => {
                        console.error('ElevenLabs Error:', error);
                        isConnected = false;
                        button.classList.remove('listening');
                        button.setAttribute('aria-label', 'Ask by voice');
                    }
                });

            } catch (err) {
                console.error("Failed to start voice agent:", err);
                button.classList.remove('listening');
                button.setAttribute('aria-label', 'Ask by voice');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupVoiceInput();

        const searchBtn = document.getElementById('heritageSearchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('heritageSearchInput');
                const title = searchInput ? searchInput.value.trim() : '';
                if (title) saveRecentExploration(title);
            });
        }
    });
})();