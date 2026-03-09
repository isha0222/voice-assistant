import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, Zap, Moon, Sun, Heart } from 'lucide-react';

// Response mapping for common phrases - Works on iPhone, Android, Desktop & Safari
const responseMap: Record<string, string[]> = {
  'hello': ['Hello there!', 'Hi! How can I help you?', 'Hey! Nice to see you!'],
  'hi': ['Hello!', 'Hi there!', 'Hey!'],
  'hiii': ['Hello!', 'Hi there!', 'Hey!'],
  'hii': ['Hello!', 'Hi there!', 'Hey!'],
  'hey': ['Hello!', 'Hi there!', 'Hey!'],
  'good morning': ['Good morning! Hope you have a great day!', 'Morning! Ready to conquer the day?', 'Good morning!'],
  'good afternoon': ['Good afternoon! Hope you\'re having a great day!', 'Good afternoon!', 'Afternoon greetings!'],
  'good evening': ['Good evening! How was your day?', 'Good evening!', 'Evening greetings!'],
  'good night': ['Good night! Sleep well!', 'Sweet dreams!', 'Good night!'],
  'i love you': ['Aww, I love you too!', 'That\'s sweet! I appreciate you!', 'You make me blush!'],
  'i love youu': ['Aww, I love you too!', 'That\'s sweet! I appreciate you!', 'You make me blush!'],
  'i miss you': ['I miss you too!', 'I\'m always here for you!', 'You\'re never alone!'],
  'i miss youu': ['I miss you too!', 'I\'m always here for you!', 'You\'re never alone!'],
  'i am always there for you': ['Thank you! That means a lot!', 'I appreciate your support!', 'You\'re the best!'],
  'i am always there for youu': ['Thank you! That means a lot!', 'I appreciate your support!', 'You\'re the best!'],
  'always there for you': ['Thank you! That means a lot!', 'I appreciate your support!', 'You\'re the best!'],
  'how are you': ['I\'m doing great, thanks for asking!', 'I\'m wonderful! How about you?', 'All systems operational!'],
  'how r you': ['I\'m doing great, thanks for asking!', 'I\'m wonderful! How about you?', 'All systems operational!'],
  'what is your name': ['I\'m your voice assistant! You can call me Alexa.', 'I\'m your personal AI assistant!', 'I\'m your friendly voice assistant!'],
  'whats your name': ['I\'m your voice assistant! You can call me Alexa.', 'I\'m your personal AI assistant!', 'I\'m your friendly voice assistant!'],
  'who are you': ['I\'m your voice assistant! You can call me Alexa.', 'I\'m your personal AI assistant!', 'I\'m your friendly voice assistant!'],
  'thank you': ['You\'re welcome!', 'My pleasure!', 'Anytime!'],
  'thanks': ['You\'re welcome!', 'My pleasure!', 'Anytime!'],
  'thankyou': ['You\'re welcome!', 'My pleasure!', 'Anytime!'],
  'goodbye': ['Goodbye! Have a great day!', 'See you later!', 'Bye! Take care!'],
  'bye': ['Goodbye! Have a great day!', 'See you later!', 'Bye! Take care!'],
  'what can you do': ['I can respond to your voice commands, tell you the time, and have simple conversations!', 'I\'m here to chat and help with simple tasks!', 'Try saying hello, ask how I am, or tell me something!'],
  'help': ['I can respond to your voice commands! Try saying hello, good morning, or I love you!', 'I\'m here to chat! Try any friendly phrase!', 'Say hello, good night, or I miss you!'],
  'tell me a joke': ['Why don\'t scientists trust atoms? Because they make up everything!', 'What do you call a fake noodle? An impasta!', 'Why did the scarecrow win an award? He was outstanding in his field!'],
  'what time is it': [`The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`],
  'what day is today': [`Today is ${new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`],
  'whats up': ['I\'m doing great! Thank you for asking. How about you?', 'Not much! Just here to help you!', 'Everything\'s good! How are you?'],
  'what\'s up': ['I\'m doing great! Thank you for asking. How about you?', 'Not much! Just here to help you!', 'Everything\'s good! How are you?'],
  'see you': ['Goodbye! Take care and come back soon!', 'See you later!', 'Take care!'],
  'take care': ['You too! Take care!', 'Goodbye! Take care and come back soon!', 'See you soon!'],
};

// Default responses for unrecognized phrases
const defaultResponses = [
  'I heard you!',
  'Interesting!',
  'Tell me more!',
  'That\'s nice!',
  'I understand.',
  'Could you repeat that?',
];

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{ speaker: 'user' | 'ai', text: string }>>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis - Works on Safari, iPhone, Android & Desktop
  useEffect(() => {
    // Check for browser support (Safari uses webkitSpeechRecognition)
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setTranscript(transcript);
      processCommand(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access in your browser settings to use voice commands.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    // Load voices for Safari (needs this trigger)
    const loadVoices = () => {
      synthRef.current?.getVoices();
    };
    
    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    // Set available commands
    setAvailableCommands(Object.keys(responseMap));

    // Add initial welcome message
    setConversation([{ speaker: 'ai', text: 'Hello! I\'m your voice assistant. Tap the microphone and say "Hello", "Good morning", or "I love you"!' }]);
  }, []);

  // Process the voice command
  const processCommand = (command: string) => {
    // Add user message to conversation with proper type
    const newConversation = [...conversation, { speaker: 'user' as const, text: command }];
    setConversation(newConversation);

    // Find matching response
    let responseText = '';
    const normalizedCommand = command.toLowerCase().trim();

    // Check for exact matches or partial matches
    for (const [key, responses] of Object.entries(responseMap)) {
      if (normalizedCommand.includes(key)) {
        responseText = responses[Math.floor(Math.random() * responses.length)];
        break;
      }
    }

    // If no match found, use default response
    if (!responseText) {
      responseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Special handling for time and date
    if (normalizedCommand.includes('time') && normalizedCommand.includes('what')) {
      responseText = `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    }
    
    if (normalizedCommand.includes('day') && normalizedCommand.includes('what')) {
      responseText = `Today is ${new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    }

    setResponse(responseText);
    
    // Add AI response to conversation
    setConversation([...newConversation, { speaker: 'ai' as const, text: responseText }]);

    // Speak the response if voice is enabled
    if (voiceEnabled && synthRef.current) {
      speakResponse(responseText);
    }
  };

  // Speak the response using speech synthesis - Optimized for Safari, iPhone & Android
  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to get a natural female voice (like Alexa)
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google US English') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Female') ||
      voice.lang === 'en-US'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Start/stop listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Toggle voice responses
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Clear conversation
  const clearConversation = () => {
    setConversation([{ speaker: 'ai' as const, text: 'Conversation cleared. How can I help you?' }]);
    setTranscript('');
    setResponse('');
  };

  // Handle manual text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('text-input') as HTMLInputElement;
    if (input.value.trim()) {
      processCommand(input.value);
      input.value = '';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600'}`}>
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Voice Assistant AI
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Your personal Alexa-like assistant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg transition-all`}
              title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
            >
              {voiceEnabled ? <Volume2 className="h-5 w-5 text-green-500" /> : <VolumeX className="h-5 w-5 text-red-500" />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg transition-all`}
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5 text-indigo-600" /> : <Sun className="h-5 w-5 text-yellow-500" />}
            </button>
            <button
              onClick={clearConversation}
              className={`px-4 py-3 rounded-xl font-medium ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-slate-800'} shadow-lg transition-all`}
            >
              Clear Chat
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Main controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Voice control section */}
            <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-2xl`}>
              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Voice visualization */}
                <div className="relative">
                  <div className={`h-64 w-64 rounded-full flex items-center justify-center ${isListening ? 'animate-pulse' : ''} ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30' : 'bg-gradient-to-br from-violet-100 to-indigo-100'}`}>
                    <button
                      onClick={toggleListening}
                      className={`h-48 w-48 rounded-full flex items-center justify-center transition-all ${isListening ? 'scale-110' : ''} ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700'} shadow-2xl`}
                    >
                      {isListening ? (
                        <MicOff className="h-16 w-16 text-white" />
                      ) : (
                        <Mic className="h-16 w-16 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {/* Animation rings */}
                  {isListening && (
                    <>
                      <div className="absolute inset-0 h-64 w-64 rounded-full border-4 border-purple-400/30 animate-ping"></div>
                      <div className="absolute inset-4 h-56 w-56 rounded-full border-4 border-blue-400/20 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    </>
                  )}
                </div>

                {/* Status indicators */}
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full mb-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                      {isListening ? 'Listening...' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full mb-2 ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                      {isSpeaking ? 'Speaking...' : 'Silent'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full mb-2 ${voiceEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                      Voice {voiceEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>

                {/* Current transcript */}
                {transcript && (
                  <div className="w-full max-w-2xl">
                    <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                      You said:
                    </h3>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-100'}`}>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{transcript}</p>
                    </div>
                  </div>
                )}

                {/* Text input fallback */}
                <div className="w-full max-w-2xl">
                  <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                    Or type your command:
                  </h3>
                  <form onSubmit={handleTextSubmit} className="flex space-x-3">
                    <input
                      id="text-input"
                      type="text"
                      className={`flex-grow p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-slate-800 placeholder-slate-400'} shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Type your message here..."
                    />
                    <button
                      type="submit"
                      className={`px-6 py-4 rounded-xl font-medium ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700'} text-white shadow-lg transition-all`}
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Current response */}
            {response && (
              <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm' : 'bg-gradient-to-br from-violet-50 to-indigo-50'} shadow-2xl`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                  Assistant Response
                </h3>
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-inner`}>
                  <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{response}</p>
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <button
                    onClick={() => speakResponse(response)}
                    disabled={isSpeaking || !voiceEnabled}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50' : 'bg-slate-200 hover:bg-slate-300 disabled:opacity-50'} transition-all`}
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Replay Voice</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Conversation and commands */}
          <div className="space-y-8">
            {/* Conversation history */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-2xl h-[500px] flex flex-col`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Heart className="h-6 w-6 mr-3 text-red-500" />
                Conversation
              </h3>
              <div className={`flex-grow overflow-y-auto pr-2 ${theme === 'dark' ? 'scrollbar-dark' : ''}`}>
                <div className="space-y-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl ${msg.speaker === 'user' 
                        ? (theme === 'dark' ? 'bg-purple-900/30 ml-8' : 'bg-violet-100 ml-8') 
                        : (theme === 'dark' ? 'bg-blue-900/30 mr-8' : 'bg-indigo-100 mr-8')
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${msg.speaker === 'user' 
                          ? (theme === 'dark' ? 'bg-purple-700' : 'bg-violet-500') 
                          : (theme === 'dark' ? 'bg-blue-700' : 'bg-indigo-500')
                        }`}>
                          {msg.speaker === 'user' ? (
                            <span className="text-white text-sm">You</span>
                          ) : (
                            <span className="text-white text-sm">AI</span>
                          )}
                        </div>
                        <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          {msg.speaker === 'user' ? 'You' : 'Assistant'}
                        </span>
                      </div>
                      <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available commands */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm' : 'bg-gradient-to-br from-violet-50 to-indigo-50'} shadow-2xl`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <HelpCircle className="h-6 w-6 mr-3 text-green-500" />
                Try Saying...
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {availableCommands.slice(0, 8).map((command, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-slate-50'} transition-all cursor-pointer`}
                    onClick={() => {
                      const input = document.getElementById('text-input') as HTMLInputElement;
                      if (input) {
                        input.value = command;
                        input.focus();
                      }
                    }}
                  >
                    <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{command}</p>
                  </div>
                ))}
              </div>
              <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Click any command to add it to the input field
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-300/30">
          <div className="text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
              Built with React, Vite & Tailwind CSS • Uses Web Speech API • Works on iPhone, Android & Desktop
            </p>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'} text-sm`}>
              Say "Hello", "Good morning", "I love you", "I miss you", or any other friendly phrase!
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;