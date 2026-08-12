export const siteMapping = {
  "127.0.0.1": ["http://127.0.0.1:8080/shakesgames2", "http://127.0.0.1:8080/shakesgames3"],
  "127.0.0.1:8080": ["http://127.0.0.1:8080/shakesgames2", "http://127.0.0.1:8080/shakesgames3"],
  "127.0.0.1:8080/shakesgames2": ["127.0.0.1:8080", "http://127.0.0.1:8080/shakesgames3"],
  "127.0.0.1:8080/shakesgames3": ["127.0.0.1:8080", "http://127.0.0.1:8080/shakesgames2"],
  "shakesgames.github.io": ["https://shakesgames.github.io/shakesgames2", "https://shakesgames.github.io/shakesgames3", "https://shakesgames.github.io/shakesgames4", "https://shakesgames.github.io/shakesgames-5", "https://shakesgames.github.io/shakesgames-6"],
  "shakesgames.github.io/shakesgames2": ["https://shakesgames.github.io", "https://shakesgames.github.io/shakesgames3", "https://shakesgames.github.io/shakesgames4", "https://shakesgames.github.io/shakesgames-5", "https://shakesgames.github.io/shakesgames-6"],
  "shakesgames.github.io/shakesgames3": ["https://shakesgames.github.io", "https://shakesgames.github.io/shakesgames2", "https://shakesgames.github.io/shakesgames4", "https://shakesgames.github.io/shakesgames-5", "https://shakesgames.github.io/shakesgames-6"],
  "shakesgames.github.io/shakesgames4": ["https://shakesgames.github.io", "https://shakesgames.github.io/shakesgames2", "https://shakesgames.github.io/shakesgames3", "https://shakesgames.github.io/shakesgames-5", "https://shakesgames.github.io/shakesgames-6"],
  "shakesgames.github.io/shakesgames-5": ["https://shakesgames.github.io", "https://shakesgames.github.io/shakesgames2", "https://shakesgames.github.io/shakesgames3", "https://shakesgames.github.io/shakesgames4", "https://shakesgames.github.io/shakesgames-6"],
  "shakesgames.github.io/shakesgames-6": ["https://shakesgames.github.io", "https://shakesgames.github.io/shakesgames2", "https://shakesgames.github.io/shakesgames3", "https://shakesgames.github.io/shakesgames4", "https://shakesgames.github.io/shakesgames-5"],
};
