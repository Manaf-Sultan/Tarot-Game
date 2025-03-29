// Tarot Card Game JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game state
    const gameState = {
        readingType: null,
        question: '',
        selectedCards: [],
        deck: [],
        soundEnabled: true,
        darkTheme: false
    };

    // DOM Elements
    const screens = document.querySelectorAll('.game-screen');
    const startReadingBtn = document.getElementById('start-reading-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const readingOptions = document.querySelectorAll('.reading-option');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const tarotDeck = document.getElementById('tarot-deck');
    const questionInput = document.getElementById('question-input');
    const selectionInstruction = document.getElementById('selection-instruction');
    const cardsToSelect = document.getElementById('cards-to-select');
    const readingContainer = document.getElementById('reading-container');
    const readingInterpretation = document.getElementById('reading-interpretation');
    const readingTitle = document.getElementById('reading-title');
    const saveReadingBtn = document.getElementById('save-reading-btn');
    const newReadingBtn = document.getElementById('new-reading-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const themeToggle = document.querySelector('.theme-toggle');
    const soundToggle = document.querySelector('.sound-toggle');
    const modal = document.getElementById('card-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCardName = document.getElementById('modal-card-name');
    const modalCardKeywords = document.getElementById('modal-card-keywords');
    const modalCardMeaning = document.getElementById('modal-card-meaning');
    const modalCardReversed = document.getElementById('modal-card-reversed');
    const modalReversedContainer = document.getElementById('modal-reversed-container');
    const cardDetailImage = document.querySelector('.card-detail-image');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const currentYear = document.getElementById('current-year');

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Sound effects
    const sounds = {
        cardFlip: new Audio('assets/sounds/card-flip.mp3'),
        cardShuffle: new Audio('assets/sounds/card-shuffle.mp3'),
        buttonClick: new Audio('assets/sounds/button-click.mp3'),
        success: new Audio('assets/sounds/success.mp3'),
        ambient: new Audio('assets/sounds/ambient.mp3')
    };

    // Initialize ambient sound
    sounds.ambient.loop = true;
    sounds.ambient.volume = 0.3;

    // Tarot card data
    const tarotCards = [
        {
            id: 0,
            name: "The Fool",
            image: "https://www.trustedtarot.com/img/cards/the-fool.png",
            keywords: "New beginnings, innocence, spontaneity, free spirit",
            meaning: "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.",
            reversedMeaning: "Holding back, recklessness, risk-taking, poor judgment, apathy, stagnation."
        },
        {
            id: 1,
            name: "The Magician",
            image: "https://www.trustedtarot.com/img/cards/the-magician.png",
            keywords: "Manifestation, resourcefulness, power, inspired action",
            meaning: "The Magician represents your ability to communicate clearly, to 'sell' yourself and to be innovative. The Magician has all the tools and resources available to manifest his desired outcome.",
            reversedMeaning: "Manipulation, poor planning, untapped talents, deception, trickery."
        },
        {
            id: 2,
            name: "The High Priestess",
            image: "https://www.trustedtarot.com/img/cards/the-high-priestess.png",
            keywords: "Intuition, sacred knowledge, divine feminine, subconscious mind",
            meaning: "The High Priestess signifies spiritual enlightenment, inner illumination, divine knowledge and wisdom. She shows you that the power is within yourself to access esoteric and mystical knowledge.",
            reversedMeaning: "Secrets, disconnected from intuition, withdrawal and silence, cognitive dissonance."
        },
        {
            id: 3,
            name: "The Empress",
            image: "https://www.trustedtarot.com/img/cards/the-empress.png",
            keywords: "Femininity, beauty, nature, nurturing, abundance",
            meaning: "The Empress signifies a strong connection with our femininity. Femininity translates in many ways – beauty, sensuality, fertility, creative expression, nurturing – and is necessary for creating balance in both men and women.",
            reversedMeaning: "Creative block, dependence on others, emptiness, neglecting self-care, smothering."
        },
        {
            id: 4,
            name: "The Emperor",
            image: "https://www.trustedtarot.com/img/cards/the-emperor.png",
            keywords: "Authority, establishment, structure, father figure",
            meaning: "The Emperor represents a powerful influence, structure, stability and security in your life. He signifies that you are in control of your life and surroundings and everything is in order.",
            reversedMeaning: "Domination, excessive control, rigidity, inflexibility, lack of discipline."
        },
        {
            id: 5,
            name: "The Hierophant",
            image: "https://www.trustedtarot.com/img/cards/the-hierophant.png",
            keywords: "Spiritual wisdom, religious beliefs, conformity, tradition, institutions",
            meaning: "The Hierophant represents traditional values and a conventional approach to life. He can represent a counselor or mentor who will provide you with wisdom and guidance or a spiritual leader who can help you find the answers you're looking for.",
            reversedMeaning: "Personal beliefs, freedom, challenging the status quo, unconventionality."
        },
        {
            id: 6,
            name: "The Lovers",
            image: "https://www.trustedtarot.com/img/cards/the-lovers.png",
            keywords: "Love, harmony, relationships, values alignment, choices",
            meaning: "The Lovers represents relationships and choices. Its appearance in a spread indicates some decision about an existing relationship, a temptation of the heart, or a choice of potential partners.",
            reversedMeaning: "Self-love, disharmony, imbalance, misalignment of values, conflict."
        },
        {
            id: 7,
            name: "The Chariot",
            image: "https://www.trustedtarot.com/img/cards/the-chariot.png",
            keywords: "Control, willpower, success, action, determination",
            meaning: "The Chariot represents overcoming obstacles through determination, focus and willpower. It indicates that you will be successful in pursuing your goals, provided you maintain focus, confidence and determination.",
            reversedMeaning: "Lack of direction, lack of control, aggression, defeat, obstacles."
        },
        {
            id: 8,
            name: "Strength",
            image: "https://www.trustedtarot.com/img/cards/strength.png",
            keywords: "Strength, courage, persuasion, influence, compassion",
            meaning: "Strength represents inner strength, fortitude, and courage. It suggests that you have the inner resources to overcome any obstacles and challenges that you may face.",
            reversedMeaning: "Inner strength, self-doubt, low energy, raw emotion, vulnerability."
        },
        {
            id: 9,
            name: "The Hermit",
            image: "https://www.trustedtarot.com/img/cards/the-hermit.png",
            keywords: "Soul-searching, introspection, being alone, inner guidance",
            meaning: "The Hermit represents a period of introspection where you dedicate yourself to understanding the deeper meaning of life. It suggests that you are in a phase of soul-searching, looking for the truth and answers within yourself.",
            reversedMeaning: "Isolation, loneliness, withdrawal, rejecting others, returning to society."
        },
        {
            id: 10,
            name: "Wheel of Fortune",
            image: "https://www.trustedtarot.com/img/cards/wheel-of-fortune.png",
            keywords: "Good luck, karma, life cycles, destiny, a turning point",
            meaning: "The Wheel of Fortune represents the ups and downs of life, good and bad luck, and external forces that are outside your control. It suggests that positive change is coming your way, and you should be ready to embrace it.",
            reversedMeaning: "Bad luck, resistance to change, breaking cycles, delays, external forces."
        },
        {
            id: 11,
            name: "Justice",
            image: "https://www.trustedtarot.com/img/cards/justice.png",
            keywords: "Justice, fairness, truth, cause and effect, law",
            meaning: "Justice represents fairness, balance, and harmony. It suggests that you are being called to account for your actions and that you will receive a fair outcome based on your past behavior.",
            reversedMeaning: "Unfairness, lack of accountability, dishonesty, unbalanced scales, bias."
        },
        {
            id: 12,
            name: "The Hanged Man",
            image: "https://www.trustedtarot.com/img/cards/the-hanged-man.png",
            keywords: "Pause, surrender, letting go, new perspectives",
            meaning: "The Hanged Man represents a period of suspension and waiting. It suggests that you may need to put things on hold or view them from a different perspective in order to move forward.",
            reversedMeaning: "Delays, resistance, stalling, indecision, stagnation."
        },
        {
            id: 13,
            name: "Death",
            image: "https://www.trustedtarot.com/img/cards/death.png",
            keywords: "Endings, change, transformation, transition",
            meaning: "Death represents the end of a major phase or aspect of your life that you realize is no longer serving you, opening up the possibility of something far more valuable and essential. It suggests that you need to let go of the past and embrace change.",
            reversedMeaning: "Resistance to change, inability to move on, stagnation, decay."
        },
        {
            id: 14,
            name: "Temperance",
            image: "https://www.trustedtarot.com/img/cards/temperance.png",
            keywords: "Balance, moderation, patience, purpose",
            meaning: "Temperance represents balance, moderation, and patience. It suggests that you need to find middle ground in a situation, avoid extremes, and practice patience in order to achieve your goals.",
            reversedMeaning: "Imbalance, excess, self-healing, realignment, re-calibration."
        },
        {
            id: 15,
            name: "The Devil",
            image: "https://www.trustedtarot.com/img/cards/the-devil.png",
            keywords: "Shadow self, attachment, addiction, restriction, sexuality",
            meaning: "The Devil represents the shadow aspects of yourself, such as greed, jealousy, and fear. It suggests that you may be feeling trapped or restricted by negative patterns or behaviors, and that you need to confront these in order to move forward.",
            reversedMeaning: "Releasing limiting beliefs, exploring dark thoughts, detachment, freedom."
        },
        {
            id: 16,
            name: "The Tower",
            image: "https://www.trustedtarot.com/img/cards/the-tower.png",
            keywords: "Sudden change, upheaval, chaos, revelation, awakening",
            meaning: "The Tower represents sudden, disruptive change and the collapse of existing structures or beliefs. It suggests that you may be experiencing a period of chaos or upheaval, but that this is necessary for your growth and transformation.",
            reversedMeaning: "Personal transformation, fear of change, averting disaster, delaying the inevitable."
        },
        {
            id: 17,
            name: "The Star",
            image: "https://www.trustedtarot.com/img/cards/the-star.png",
            keywords: "Hope, faith, purpose, renewal, spirituality",
            meaning: "The Star represents hope, inspiration, and spiritual guidance. It suggests that you are entering a period of peace, openness, and optimism, and that you should trust in the universe to guide you towards your destiny.",
            reversedMeaning: "Lack of faith, despair, self-trust, disconnection, discouragement."
        },
        {
            id: 18,
            name: "The Moon",
            image: "https://www.trustedtarot.com/img/cards/the-moon.png",
            keywords: "Illusion, fear, anxiety, subconscious, intuition",
            meaning: "The Moon represents illusion, fear, and the subconscious. It suggests that you may be experiencing confusion or deception, and that you need to trust your intuition to navigate through this period of uncertainty.",
            reversedMeaning: "Release of fear, repressed emotion, inner confusion, clarity of thought."
        },
        {
            id: 19,
            name: "The Sun",
            image: "https://www.trustedtarot.com/img/cards/the-sun.png",
            keywords: "Positivity, fun, warmth, success, vitality",
            meaning: "The Sun represents success, joy, and positive energy. It suggests that you are entering a period of happiness and fulfillment, and that your hard work and dedication will be rewarded.",
            reversedMeaning: "Inner child, feeling down, overly optimistic, unrealistic expectations."
        },
        {
            id: 20,
            name: "Judgement",
            image: "https://www.trustedtarot.com/img/cards/judgement.png",
            keywords: "Judgement, rebirth, inner calling, absolution",
            meaning: "Judgement represents self-evaluation, awakening, and renewal. It suggests that you are in a period of self-reflection and assessment, and that you need to make important decisions about your future based on what you have learned from the past.",
            reversedMeaning: "Self-doubt, inner critic, ignoring the call, self-loathing."
        },
        {
            id: 21,
            name: "The World",
            image: "https://www.trustedtarot.com/img/cards/the-world.png",
            keywords: "Completion, integration, accomplishment, travel",
            meaning: "The World represents completion, achievement, and fulfillment. It suggests that you have reached the end of a cycle or journey, and that you should celebrate your accomplishments before embarking on a new adventure.",
            reversedMeaning: "Seeking closure, short-cuts, delays, feeling incomplete."
        }
    ];

    // Initialize the game
    function initGame() {
        // Set up event listeners
        setupEventListeners();
        
        // Preload sounds
        preloadSounds();
        
        // Set up the deck
        setupDeck();
        
        // Check for dark mode preference
        checkDarkModePreference();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Start reading button
        startReadingBtn.addEventListener('click', function() {
            playSound('buttonClick');
            showScreen('reading-type-screen');
        });

        // How to play button
        howToPlayBtn.addEventListener('click', function() {
            playSound('buttonClick');
            showScreen('how-to-play-screen');
        });

        // Reading options
        readingOptions.forEach(option => {
            option.addEventListener('click', function() {
                playSound('buttonClick');
                
                // Remove selected class from all options
                readingOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Set reading type
                gameState.readingType = this.dataset.reading;
                
                // Set number of cards to select based on reading type
                if (gameState.readingType === 'single') {
                    gameState.cardsToSelect = 1;
                } else if (gameState.readingType === 'three-card') {
                    gameState.cardsToSelect = 3;
                } else if (gameState.readingType === 'celtic-cross') {
                    gameState.cardsToSelect = 10;
                }
                
                // Update cards to select text
                cardsToSelect.textContent = gameState.cardsToSelect;
                
                // Show question screen
                showScreen('question-screen');
            });
        });

        // Shuffle button
        shuffleBtn.addEventListener('click', function() {
            playSound('cardShuffle');
            
            // Get question
            gameState.question = questionInput.value;
            
            // Show loading overlay
            loadingOverlay.classList.add('active');
            
            // Simulate shuffling delay
            setTimeout(function() {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
                
                // Shuffle deck
                shuffleDeck();
                
                // Create card elements
                createCardElements();
                
                // Show card selection screen
                showScreen('card-selection-screen');
            }, 1500);
        });

        // Save reading button
        saveReadingBtn.addEventListener('click', function() {
            playSound('buttonClick');
            saveReading();
        });

        // New reading button
        newReadingBtn.addEventListener('click', function() {
            playSound('buttonClick');
            resetGame();
            showScreen('welcome-screen');
        });

        // Back buttons
        backBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                playSound('buttonClick');
                const targetScreen = this.dataset.target;
                showScreen(targetScreen);
            });
        });

        // Theme toggle
        themeToggle.addEventListener('click', function() {
            playSound('buttonClick');
            toggleTheme();
        });

        // Sound toggle
        soundToggle.addEventListener('click', function() {
            toggleSound();
        });

        // Close modal
        closeModal.addEventListener('click', function() {
            playSound('buttonClick');
            closeCardModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                playSound('buttonClick');
                closeCardModal();
            }
        });
    }

    // Preload sounds
    function preloadSounds() {
        // Start ambient sound
        document.addEventListener('click', function() {
            if (gameState.soundEnabled && sounds.ambient.paused) {
                sounds.ambient.play().catch(error => console.log('Ambient sound autoplay prevented:', error));
            }
        }, { once: true });
    }

    // Play sound
    function playSound(soundName) {
        if (gameState.soundEnabled && sounds[soundName]) {
            // Create a clone of the audio to allow overlapping sounds
            const sound = sounds[soundName].cloneNode();
            sound.volume = sounds[soundName].volume || 1;
            sound.play().catch(error => console.log(`Sound play prevented: ${soundName}`, error));
        }
    }

    // Toggle sound
    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        
        // Update sound icon
        const soundIcon = soundToggle.querySelector('i');
        if (gameState.soundEnabled) {
            soundIcon.className = 'fas fa-volume-up';
            sounds.ambient.play().catch(error => console.log('Ambient sound play prevented:', error));
        } else {
            soundIcon.className = 'fas fa-volume-mute';
            sounds.ambient.pause();
        }
        
        playSound('buttonClick');
    }

    // Toggle theme
    function toggleTheme() {
        gameState.darkTheme = !gameState.darkTheme;
        
        // Update theme
        document.body.classList.toggle('dark-theme', gameState.darkTheme);
        
        // Update theme icon
        const themeIcon = themeToggle.querySelector('i');
        themeIcon.className = gameState.darkTheme ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save theme preference
        localStorage.setItem('darkTheme', gameState.darkTheme);
    }

    // Check dark mode preference
    function checkDarkModePreference() {
        // Check localStorage
        const savedTheme = localStorage.getItem('darkTheme');
        
        if (savedTheme === 'true') {
            gameState.darkTheme = true;
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        } else if (savedTheme === null) {
            // Check system preference if no saved preference
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            if (prefersDarkScheme.matches) {
                gameState.darkTheme = true;
                document.body.classList.add('dark-theme');
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        }
    }

    // Set up the deck
    function setupDeck() {
        gameState.deck = [...tarotCards];
    }

    // Shuffle deck
    function shuffleDeck() {
        // Reset selected cards
        gameState.selectedCards = [];
        
        // Shuffle the deck (Fisher-Yates algorithm)
        for (let i = gameState.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
        }
    }

    // Create card elements
    function createCardElements() {
        // Clear deck
        tarotDeck.innerHTML = '';
        
        // Create cards (limit to 24 for better UI)
        const numCards = Math.min(24, gameState.deck.length);
        
        for (let i = 0; i < numCards; i++) {
            const card = document.createElement('div');
            card.className = 'tarot-card';
            card.dataset.index = i;
            
            // Create card front (back of card)
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            // Create card back (face of card)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            // Add card image to back
            const cardImage = document.createElement('img');
            cardImage.src = gameState.deck[i].image;
            cardImage.alt = gameState.deck[i].name;
            cardBack.appendChild(cardImage);
            
            // Add front and back to card
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            // Add click event
            card.addEventListener('click', handleCardClick);
            
            // Add card to deck
            tarotDeck.appendChild(card);
        }
    }

    // Handle card click
    function handleCardClick(event) {
        const card = event.currentTarget;
        const cardIndex = parseInt(card.dataset.index);
        
        // Check if card is already selected
        if (card.classList.contains('selected')) {
            return;
        }
        
        // Check if we've selected enough cards
        if (gameState.selectedCards.length >= gameState.cardsToSelect) {
            return;
        }
        
        // Play card flip sound
        playSound('cardFlip');
        
        // Mark card as selected
        card.classList.add('selected');
        
        // Add card to selected cards
        const selectedCard = gameState.deck[cardIndex];
        
        // Randomly determine if card is reversed (20% chance)
        const isReversed = Math.random() < 0.2;
        
        gameState.selectedCards.push({
            ...selectedCard,
            isReversed: isReversed
        });
        
        // Update selection instruction
        const remainingCards = gameState.cardsToSelect - gameState.selectedCards.length;
        
        if (remainingCards > 0) {
            cardsToSelect.textContent = remainingCards;
        } else {
            // All cards selected, show reading
            setTimeout(() => {
                playSound('success');
                displayReading();
            }, 1000);
        }
    }

    // Display reading
    function displayReading() {
        // Clear reading container
        readingContainer.innerHTML = '';
        readingInterpretation.innerHTML = '';
        
        // Set reading title based on type
        if (gameState.readingType === 'single') {
            readingTitle.textContent = 'Your Single Card Reading';
        } else if (gameState.readingType === 'three-card') {
            readingTitle.textContent = 'Your Past-Present-Future Reading';
        } else if (gameState.readingType === 'celtic-cross') {
            readingTitle.textContent = 'Your Celtic Cross Reading';
        }
        
        // Create reading cards
        gameState.selectedCards.forEach((card, index) => {
            // Create card element
            const cardElement = document.createElement('div');
            cardElement.className = 'reading-card';
            cardElement.dataset.index = index;
            
            // Create card image
            const cardImage = document.createElement('img');
            cardImage.src = card.image;
            cardImage.alt = card.name;
            
            // Apply rotation for reversed cards
            if (card.isReversed) {
                cardImage.style.transform = 'rotate(180deg)';
            }
            
            // Create card position label
            const cardPosition = document.createElement('div');
            cardPosition.className = 'card-position';
            
            // Set position text based on reading type
            if (gameState.readingType === 'single') {
                cardPosition.textContent = 'Your Card';
            } else if (gameState.readingType === 'three-card') {
                const positions = ['Past', 'Present', 'Future'];
                cardPosition.textContent = positions[index];
            } else if (gameState.readingType === 'celtic-cross') {
                const positions = [
                    'Present', 'Challenge', 'Past', 'Future', 
                    'Above', 'Below', 'Advice', 'External', 
                    'Hopes/Fears', 'Outcome'
                ];
                cardPosition.textContent = positions[index];
            }
            
            // Add click event to show card details
            cardElement.addEventListener('click', function() {
                playSound('buttonClick');
                showCardDetails(card);
            });
            
            // Add elements to card
            cardElement.appendChild(cardImage);
            cardElement.appendChild(cardPosition);
            
            // Add card to reading container
            readingContainer.appendChild(cardElement);
            
            // Create interpretation section
            const interpretationSection = document.createElement('div');
            interpretationSection.className = 'card-meaning-section';
            
            // Create section header with card thumbnail
            const sectionHeader = document.createElement('h3');
            
            // Create thumbnail container
            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'card-thumbnail';
            
            // Create thumbnail image
            const thumbnailImage = document.createElement('img');
            thumbnailImage.src = card.image;
            thumbnailImage.alt = card.name;
            
            // Add thumbnail image to container
            thumbnailContainer.appendChild(thumbnailImage);
            
            // Add thumbnail and card name to header
            sectionHeader.appendChild(thumbnailContainer);
            sectionHeader.appendChild(document.createTextNode(`${card.name}${card.isReversed ? ' (Reversed)' : ''}`));
            
            // Create interpretation text
            const interpretationText = document.createElement('p');
            
            // Set interpretation text based on reading type
            if (gameState.readingType === 'single') {
                interpretationText.textContent = card.isReversed ? card.reversedMeaning : card.meaning;
            } else if (gameState.readingType === 'three-card') {
                const positions = ['Past', 'Present', 'Future'];
                const positionText = positions[index];
                
                interpretationText.textContent = `${positionText}: ${card.isReversed ? card.reversedMeaning : card.meaning}`;
            } else if (gameState.readingType === 'celtic-cross') {
                const positions = [
                    'Present Situation', 'Challenge or Obstacle', 'Past Influence', 'Future Influence', 
                    'Your Conscious Goals', 'Your Subconscious Influences', 'Advice to Consider', 
                    'External Influences', 'Hopes and Fears', 'Final Outcome'
                ];
                const positionText = positions[index];
                
                interpretationText.textContent = `${positionText}: ${card.isReversed ? card.reversedMeaning : card.meaning}`;
            }
            
            // Add header and text to section
            interpretationSection.appendChild(sectionHeader);
            interpretationSection.appendChild(interpretationText);
            
            // Add section to interpretation container
            readingInterpretation.appendChild(interpretationSection);
        });
        
        // Show reading screen
        showScreen('reading-screen');
    }

    // Show card details in modal
    function showCardDetails(card) {
        // Set modal content
        modalCardName.textContent = card.name;
        modalCardKeywords.textContent = card.keywords;
        modalCardMeaning.textContent = card.meaning;
        modalCardReversed.textContent = card.reversedMeaning;
        
        // Show/hide reversed meaning based on card orientation
        modalReversedContainer.style.display = 'block';
        
        // Set card image
        cardDetailImage.innerHTML = '';
        const cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = card.name;
        
        // Apply rotation for reversed cards
        if (card.isReversed) {
            cardImage.style.transform = 'rotate(180deg)';
        }
        
        cardDetailImage.appendChild(cardImage);
        
        // Show modal
        modal.style.display = 'block';
    }

    // Close card modal
    function closeCardModal() {
        modal.style.display = 'none';
    }

    // Save reading
    function saveReading() {
        // Create a text representation of the reading
        let readingText = `Tarot Reading - ${new Date().toLocaleString()}\n\n`;
        
        // Add question if provided
        if (gameState.question) {
            readingText += `Question: ${gameState.question}\n\n`;
        }
        
        // Add reading type
        if (gameState.readingType === 'single') {
            readingText += 'Reading Type: Single Card\n\n';
        } else if (gameState.readingType === 'three-card') {
            readingText += 'Reading Type: Past-Present-Future\n\n';
        } else if (gameState.readingType === 'celtic-cross') {
            readingText += 'Reading Type: Celtic Cross\n\n';
        }
        
        // Add cards and interpretations
        gameState.selectedCards.forEach((card, index) => {
            let positionText = '';
            
            if (gameState.readingType === 'single') {
                positionText = 'Your Card';
            } else if (gameState.readingType === 'three-card') {
                const positions = ['Past', 'Present', 'Future'];
                positionText = positions[index];
            } else if (gameState.readingType === 'celtic-cross') {
                const positions = [
                    'Present Situation', 'Challenge or Obstacle', 'Past Influence', 'Future Influence', 
                    'Your Conscious Goals', 'Your Subconscious Influences', 'Advice to Consider', 
                    'External Influences', 'Hopes and Fears', 'Final Outcome'
                ];
                positionText = positions[index];
            }
            
            readingText += `${positionText}: ${card.name}${card.isReversed ? ' (Reversed)' : ''}\n`;
            readingText += `${card.isReversed ? card.reversedMeaning : card.meaning}\n\n`;
        });
        
        // Create a blob and download link
        const blob = new Blob([readingText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tarot-reading.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Show screen
    function showScreen(screenId) {
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    // Reset game
    function resetGame() {
        // Reset game state
        gameState.readingType = null;
        gameState.question = '';
        gameState.selectedCards = [];
        
        // Reset UI
        questionInput.value = '';
        readingOptions.forEach(option => option.classList.remove('selected'));
    }

    // Initialize the game
    initGame();
});
