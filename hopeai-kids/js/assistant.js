/* ============================================
   HopeAI Kids — Assistant, écoute vocale et accompagnement
   This module runs entirely in the browser. Voice recognition uses the
   browser's Web Speech API when it is available.
   ============================================ */

(function () {
  'use strict';

  const AssistantState = {
    isListening: false,
    isSpeaking: true,
    recognition: null,
    speechSubmitted: false
  };

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

  const emotionLexicon = {
    joy: [
      'heureux', 'heureuse', 'joyeux', 'joyeuse', 'ravi', 'ravie', 'content',
      'contente', 'génial', 'genial', 'super', 'formidable', 'fièr', 'fiere',
      'fier', 'fière', 'souris', '😊', '😃', '🎉'
    ],
    sadness: [
      'triste', 'tristesse', 'malheureux', 'malheureuse', 'déçu', 'déçue',
      'pleure', 'pleurer', 'seul', 'seule', 'solitaire', 'chagrin', 'pas bien',
      'déprimé', 'déprimée', '😢', '😞', '💔'
    ],
    worry: [
      'inquiet', 'inquiète', 'inquiétude', 'stressé', 'stressée', 'angoissé',
      'angoissée', 'nerveux', 'nerveuse', 'préoccupé', 'préoccupée', 'problème',
      'difficile', 'difficulté', 'pression', '😟', '😕'
    ],
    fear: [
      'peur', 'effrayé', 'effrayée', 'terrifié', 'terrifiée', 'cauchemar',
      'monstre', 'menace', 'danger', '😨', '😰', '😱'
    ],
    anger: [
      'fâché', 'fâchée', 'colère', 'énervé', 'énervée', 'furieux', 'furieuse',
      'agacé', 'agacée', 'injuste', 'déteste', '😠', '😡'
    ],
    fatigue: [
      'fatigué', 'fatiguée', 'épuisé', 'épuisée', 'dormir', 'sommeil', 'lassé',
      'lassée', 'sans énergie', 'sans energie'
    ]
  };

  const safetyTerms = [
    'me faire du mal', 'faire du mal', 'me tuer', 'suicide', 'suicider',
    'je veux mourir', 'veux mourir', 'veux disparaître', 'veux disparaitre',
    'on me frappe', 'on me fait mal', 'maltraitance', 'violence',
    'danger immédiat', 'danger immediat'
  ];

  const supportProfiles = {
    joy: {
      label: 'Joie',
      emoji: '😊',
      summary: 'Votre message contient des indices d’une émotion positive.',
      actions: [
        'Prenez un instant pour nommer ce qui vous fait du bien.',
        'Partagez cette réussite ou ce bon moment avec une personne de confiance.',
        'Choisissez une petite activité qui prolonge cette énergie positive.'
      ],
      question: 'Qu’aimeriez-vous célébrer ou apprendre maintenant ?',
      introduction: 'Je suis heureux de sentir cette énergie positive.'
    },
    sadness: {
      label: 'Tristesse',
      emoji: '😢',
      summary: 'Votre message évoque de la tristesse ou un moment difficile.',
      actions: [
        'Mettez des mots simples sur ce qui vous pèse : « je suis triste parce que… ».',
        'Respirez lentement : inspirez pendant 4 secondes, puis expirez pendant 6 secondes, trois fois.',
        'Parlez-en à un adulte ou à une personne de confiance près de vous.'
      ],
      question: 'Souhaitez-vous me raconter ce qui rend ce moment difficile ?',
      introduction: 'Merci de me le confier. Vos émotions ont de l’importance.'
    },
    worry: {
      label: 'Inquiétude',
      emoji: '😟',
      summary: 'Votre message semble exprimer une inquiétude ou du stress.',
      actions: [
        'Identifiez une seule chose qui vous inquiète le plus en ce moment.',
        'Distinguez ce que vous pouvez faire maintenant de ce qui peut attendre.',
        'Demandez de l’aide à un adulte de confiance pour choisir la prochaine petite étape.'
      ],
      question: 'Quelle est la plus petite étape que nous pouvons préparer ensemble ?',
      introduction: 'Je comprends que cette situation puisse sembler lourde.'
    },
    fear: {
      label: 'Peur',
      emoji: '😨',
      summary: 'Votre message contient des indices de peur ou de malaise.',
      actions: [
        'Regardez autour de vous et nommez 5 choses que vous voyez pour revenir au présent.',
        'Rapprochez-vous d’un endroit et d’une personne où vous vous sentez en sécurité.',
        'Dites clairement à un adulte de confiance ce qui vous fait peur.'
      ],
      question: 'Êtes-vous dans un endroit sûr, et qui pourrait être près de vous ?',
      introduction: 'Vous n’avez pas à rester seul face à ce qui vous fait peur.'
    },
    anger: {
      label: 'Colère',
      emoji: '😠',
      summary: 'Votre message évoque de la colère ou de la frustration.',
      actions: [
        'Faites une pause avant de répondre ou d’agir.',
        'Éloignez-vous quelques instants de ce qui augmente la tension si vous le pouvez.',
        'Expliquez ensuite ce qui vous a blessé en utilisant « je ressens… ».'
      ],
      question: 'Qu’est-ce qui vous a mis en colère, et de quoi auriez-vous besoin maintenant ?',
      introduction: 'La colère peut signaler qu’une situation vous semble injuste ou trop difficile.'
    },
    fatigue: {
      label: 'Fatigue',
      emoji: '😴',
      summary: 'Votre message indique que vous pourriez manquer d’énergie ou de repos.',
      actions: [
        'Buvez un peu d’eau et prenez une courte pause loin des écrans si possible.',
        'Choisissez une seule tâche simple plutôt que de tout faire à la fois.',
        'Parlez à un adulte si la fatigue est forte, inhabituelle ou dure longtemps.'
      ],
      question: 'Souhaitez-vous faire une petite pause ou organiser une tâche plus simplement ?',
      introduction: 'Votre corps et votre esprit ont parfois besoin d’un temps de récupération.'
    },
    neutral: {
      label: 'À l’écoute',
      emoji: '💬',
      summary: 'Je n’ai pas repéré d’émotion forte dans ce message ; je reste disponible pour vous écouter.',
      actions: [
        'Dites en une phrase ce dont vous avez besoin maintenant.',
        'Choisissez si vous préférez parler, apprendre quelque chose ou faire une courte pause.',
        'Si le sujet vous préoccupe, cherchez un adulte de confiance avec qui en parler.'
      ],
      question: 'Comment puis-je vous accompagner ?',
      introduction: 'Merci pour votre message.'
    },
    safety: {
      label: 'Besoin de soutien immédiat',
      emoji: '🛟',
      summary: 'Des mots qui peuvent signaler un danger ou une grande détresse ont été repérés.',
      actions: [
        'Ne restez pas seul : allez maintenant vers un adulte de confiance près de vous.',
        'Dites une phrase directe : « J’ai besoin d’aide maintenant, je ne me sens pas en sécurité. »',
        'S’il y a un danger immédiat, contactez les services d’urgence de votre région avec cet adulte.'
      ],
      question: 'Qui pouvez-vous prévenir tout de suite pour rester en sécurité ?',
      introduction: 'Merci de l’avoir dit. Votre sécurité est la priorité.'
    }
  };

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function findMatches(text, terms) {
    const normalizedText = normalize(text);
    return terms.filter(term => normalizedText.includes(normalize(term)));
  }

  function detectIntent(text) {
    const normalizedText = normalize(text);
    if (/(devoir|exercice|math|mathematique|lecon|lecture|ecrire|ecriture)/.test(normalizedText)) return 'homework';
    if (/(histoire|raconte|conte|aventure)/.test(normalizedText)) return 'story';
    if (/(respire|calme|detendre|détendre|pause)/.test(normalizedText)) return 'calm';
    return 'conversation';
  }

  function analyseMessage(text) {
    const scores = {};
    const matches = {};

    Object.entries(emotionLexicon).forEach(([emotion, terms]) => {
      matches[emotion] = findMatches(text, terms);
      scores[emotion] = matches[emotion].length;
    });

    const safetyMatches = findMatches(text, safetyTerms);
    const intent = detectIntent(text);
    let category = 'neutral';

    if (safetyMatches.length) {
      category = 'safety';
    } else {
      const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      if (strongest && strongest[1] > 0) category = strongest[0];
    }

    const profile = supportProfiles[category];
    const detectedWords = category === 'safety'
      ? safetyMatches
      : (matches[category] || []);

    return {
      category,
      profile,
      intent,
      urgent: category === 'safety',
      detectedWords,
      scores
    };
  }

  function responseForIntent(analysis) {
    if (analysis.urgent) {
      return `${analysis.profile.introduction}\n\n${analysis.profile.actions[0]} ${analysis.profile.actions[1]} ${analysis.profile.actions[2]}\n\n${analysis.profile.question}`;
    }

    if (analysis.intent === 'homework') {
      return `${analysis.profile.introduction}\n\nNous pouvons avancer pas à pas : envoyez l’énoncé, dites ce que vous avez déjà essayé, puis nous chercherons ensemble la prochaine étape.\n\nComment puis-je vous accompagner avec cet exercice ?`;
    }

    if (analysis.intent === 'story') {
      return `${analysis.profile.introduction}\n\nJe peux vous raconter une histoire, vous aider à en imaginer une ou choisir une aventure adaptée à votre humeur.\n\nComment puis-je vous accompagner ?`;
    }

    if (analysis.intent === 'calm') {
      return `${analysis.profile.introduction}\n\nEssayons ceci ensemble : inspirez doucement pendant 4 secondes, expirez pendant 6 secondes, puis recommencez trois fois.\n\nComment puis-je vous accompagner après cette pause ?`;
    }

    return `${analysis.profile.introduction}\n\n${analysis.profile.actions[0]}\n\nComment puis-je vous accompagner ? ${analysis.profile.question}`;
  }

  function setVoiceTranscript(message, status, isFinal) {
    const box = document.getElementById('voiceTranscript');
    const text = document.getElementById('voiceTranscriptText');
    const label = document.getElementById('voiceTranscriptStatus');
    if (!box || !text || !label) return;

    box.hidden = false;
    box.classList.toggle('is-final', Boolean(isFinal));
    label.textContent = status;
    text.textContent = message || '…';
  }

  function updateListeningUI(isListening) {
    const button = document.getElementById('voiceBtn');
    const indicator = document.getElementById('recordingIndicator');
    if (button) {
      button.classList.toggle('active', isListening);
      button.setAttribute('aria-pressed', String(isListening));
      button.title = isListening ? 'Arrêter l’écoute' : 'Parler à HopeAI';
    }
    if (indicator) indicator.classList.toggle('active', isListening);
  }

  function initRecognition() {
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      AssistantState.isListening = true;
      AssistantState.speechSubmitted = false;
      updateListeningUI(true);
      setVoiceTranscript('Parlez naturellement : vos mots apparaîtront ici.', 'Écoute en cours', false);
    };

    recognition.onresult = event => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }

      const transcript = `${finalTranscript} ${interimTranscript}`.trim();
      const input = document.getElementById('messageInput');
      if (input && transcript) {
        input.value = transcript;
        resizeInput(input);
      }

      setVoiceTranscript(
        transcript || 'Je vous écoute…',
        finalTranscript ? 'Transcription terminée — analyse en cours' : 'Transcription en direct',
        Boolean(finalTranscript)
      );

      if (finalTranscript && !AssistantState.speechSubmitted) {
        AssistantState.speechSubmitted = true;
        window.setTimeout(() => sendMessage('voice'), 300);
      }
    };

    recognition.onerror = event => {
      const messageByError = {
        'not-allowed': 'L’accès au microphone a été refusé. Autorisez-le puis réessayez.',
        'service-not-allowed': 'Le service de transcription n’est pas autorisé par ce navigateur.',
        'no-speech': 'Je n’ai pas entendu de voix. Réessayez en parlant un peu plus près du microphone.',
        'audio-capture': 'Aucun microphone n’a été trouvé ou il est déjà utilisé.',
        'network': 'La transcription vocale nécessite une connexion réseau dans ce navigateur.'
      };
      const message = messageByError[event.error] || 'La transcription vocale n’a pas pu démarrer.';
      setVoiceTranscript(message, 'Mode vocal indisponible', true);
      App.showToast('warning', 'Mode vocal', message);
    };

    recognition.onend = () => {
      AssistantState.isListening = false;
      updateListeningUI(false);
    };

    return recognition;
  }

  function toggleVoice() {
    if (!SpeechRecognitionAPI) {
      const message = 'La reconnaissance vocale n’est pas prise en charge par ce navigateur. Essayez une version récente de Chrome, Edge ou Safari.';
      setVoiceTranscript(message, 'Mode vocal non pris en charge', true);
      App.showToast('warning', 'Mode vocal', message);
      return;
    }

    if (!AssistantState.recognition) AssistantState.recognition = initRecognition();

    if (AssistantState.isListening) {
      AssistantState.recognition.stop();
      return;
    }

    try {
      AssistantState.recognition.start();
    } catch (error) {
      // Calling start twice while a recognition session is closing raises InvalidStateError.
      if (error.name !== 'InvalidStateError') {
        App.showToast('error', 'Mode vocal', 'Impossible de démarrer l’écoute. Réessayez dans un instant.');
      }
    }
  }

  function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    if (!container || document.getElementById('typingIndicator')) return;
    container.insertAdjacentHTML('beforeend', `
      <div id="typingIndicator" class="message ai" aria-label="HopeAI prépare sa réponse">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator"><span></span><span></span><span></span></div>
        </div>
      </div>
    `);
    container.scrollTop = container.scrollHeight;
  }

  function hideTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
  }

  function messageActionsHtml() {
    return `
      <div class="message-actions">
        <button class="message-action-btn" onclick="speakMessage(this)" title="Écouter cette réponse" aria-label="Écouter cette réponse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        </button>
        <button class="message-action-btn" onclick="copyMessage(this)" title="Copier cette réponse" aria-label="Copier cette réponse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    `;
  }

  function addMessage(type, text, analysis = null, source = 'text') {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const safeText = utils.sanitizeHTML(text).replace(/\n/g, '<br>');
    const emotionHtml = type === 'ai' && analysis && analysis.category !== 'neutral'
      ? `<div class="emotion-display"><span class="emotion-chip ${analysis.category}">${analysis.profile.emoji} Analyse : ${utils.sanitizeHTML(analysis.profile.label)}</span></div>`
      : '';
    const sourceHtml = type === 'user' && source === 'voice'
      ? '<div class="message-source">🎙️ Transcription vocale</div>'
      : '';

    container.insertAdjacentHTML('beforeend', `
      <div class="message ${type}">
        <div class="message-avatar">${type === 'ai' ? '🤖' : '👤'}</div>
        <div class="message-content">
          ${emotionHtml}
          ${sourceHtml}
          <div class="message-text">${safeText}</div>
          <div class="message-time">${time}</div>
          ${type === 'ai' ? messageActionsHtml() : ''}
        </div>
      </div>
    `);
    container.scrollTop = container.scrollHeight;
  }

  function updateSupportPlan(analysis) {
    const profile = analysis.profile;
    const emotion = document.getElementById('supportEmotion');
    const summary = document.getElementById('supportSummary');
    const actions = document.getElementById('supportActions');
    const question = document.getElementById('supportQuestion');
    const safety = document.getElementById('safetyNotice');
    const keywords = document.getElementById('supportKeywords');

    if (!emotion || !summary || !actions || !question || !safety || !keywords) return;

    emotion.textContent = `${profile.emoji} ${profile.label}`;
    emotion.className = `support-emotion ${analysis.category}`;
    summary.textContent = profile.summary;
    actions.innerHTML = profile.actions
      .map((action, index) => `<li><span class="support-step">${index + 1}</span><span>${utils.sanitizeHTML(action)}</span></li>`)
      .join('');
    question.textContent = profile.question;
    safety.hidden = !analysis.urgent;

    if (analysis.detectedWords.length) {
      keywords.hidden = false;
      keywords.textContent = `Indices repérés : ${analysis.detectedWords.map(utils.sanitizeHTML).join(', ')}`;
    } else {
      keywords.hidden = true;
      keywords.textContent = '';
    }
  }

  function sendMessage(source = 'text') {
    const input = document.getElementById('messageInput');
    const message = input?.value.trim();
    if (!message) return;

    const analysis = analyseMessage(message);
    addMessage('user', message, null, source);
    updateSupportPlan(analysis);
    input.value = '';
    resizeInput(input);
    showTypingIndicator();

    window.setTimeout(() => {
      hideTypingIndicator();
      const response = responseForIntent(analysis);
      addMessage('ai', response, analysis);
      if (AssistantState.isSpeaking) speakText(response);
    }, analysis.urgent ? 350 : 800);
  }

  function toggleSpeech() {
    AssistantState.isSpeaking = !AssistantState.isSpeaking;
    const button = document.getElementById('speakBtn');
    button?.classList.toggle('active', AssistantState.isSpeaking);
    button?.setAttribute('aria-pressed', String(AssistantState.isSpeaking));
    App.showToast(
      'info',
      'Lecture vocale',
      AssistantState.isSpeaking ? 'Activée : les réponses seront lues à voix haute.' : 'Désactivée.'
    );
  }

  function speakText(text) {
    if (!AssistantState.isSpeaking || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }

  function speakMessage(button) {
    const text = button.closest('.message-content')?.querySelector('.message-text')?.textContent;
    if (text) speakText(text);
  }

  async function copyMessage(button) {
    const text = button.closest('.message-content')?.querySelector('.message-text')?.textContent;
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      App.showToast('success', 'Copié', 'La réponse a été copiée dans le presse-papiers.');
    } catch (error) {
      App.showToast('error', 'Copie impossible', 'Sélectionnez le texte manuellement pour le copier.');
    }
  }

  function resizeInput(input) {
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }

  function initAssistant() {
    const input = document.getElementById('messageInput');
    const speechButton = document.getElementById('speakBtn');
    const voiceButton = document.getElementById('voiceBtn');

    speechButton?.classList.toggle('active', AssistantState.isSpeaking);
    speechButton?.setAttribute('aria-pressed', String(AssistantState.isSpeaking));

    if (!SpeechRecognitionAPI && voiceButton) {
      voiceButton.classList.add('unsupported');
      voiceButton.title = 'Reconnaissance vocale non disponible dans ce navigateur';
    }

    input?.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });

    input?.addEventListener('input', () => resizeInput(input));
  }

  window.toggleVoice = toggleVoice;
  window.toggleSpeech = toggleSpeech;
  window.sendMessage = sendMessage;
  window.speakMessage = speakMessage;
  window.copyMessage = copyMessage;
  window.HopeAICompanion = { analyseMessage, sendMessage, toggleVoice };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAssistant);
  else initAssistant();
})();
