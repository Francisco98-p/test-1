const axios = require('axios');

class AIClient {
  constructor() {
    this.apiKey = process.env.HF_API_KEY;
    // URL actualizada - HuggingFace cambió su API
    this.apiUrl = 'https://router.huggingface.co/hf-inference/models/gpt2';
    // Alternativa si la anterior falla:
    // this.apiUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-small';
  }

  async generateArticle(topic = 'technology') {
    const prompt = `Write a short blog post about ${topic}:`;
    
    try {
      const response = await axios.post(
        this.apiUrl,
        { 
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 segundos timeout
        }
      );
      
      // Diferentes formatos de respuesta posibles
      if (Array.isArray(response.data) && response.data[0]) {
        return response.data[0].generated_text || `Sample article about ${topic}.`;
      } else if (response.data.generated_text) {
        return response.data.generated_text;
      } else if (response.data[0]?.generated_text) {
        return response.data[0].generated_text;
      } else {
        return `This is an AI-generated article about ${topic}. ${JSON.stringify(response.data).substring(0, 100)}...`;
      }
    } catch (error) {
      console.error('AI API error:', error.message);
      
      // Fallback 1: Si es error 410 (endpoint cambiado), usa alternativa
      if (error.response?.status === 410) {
        console.log('Trying alternative HuggingFace endpoint...');
        return this.generateWithFallback(topic);
      }
      
      // Fallback 2: Artículo de muestra
      return this.getFallbackArticle(topic);
    }
  }

  // Método alternativo si el endpoint principal falla
  async generateWithFallback(topic) {
    try {
      // Intenta con un modelo diferente
      const fallbackUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-small';
      const response = await axios.post(
        fallbackUrl,
        { 
          inputs: `Write about: ${topic}`,
          parameters: { max_length: 150 }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      return response.data[0]?.generated_text || this.getFallbackArticle(topic);
    } catch (fallbackError) {
      console.error('Fallback AI also failed:', fallbackError.message);
      return this.getFallbackArticle(topic);
    }
  }

  // Artículo de muestra para desarrollo/testing
  getFallbackArticle(topic) {
    const fallbackArticles = {
      'technology': `Technology is rapidly evolving. From AI to blockchain, innovations are transforming our world. This article discusses ${topic} and its impact on modern society.`,
      'web development': `Web development continues to advance with new frameworks and tools. ${topic} represents the cutting edge of creating dynamic, responsive websites.`,
      'artificial intelligence': `AI is revolutionizing industries. ${topic} showcases how machine learning algorithms can solve complex problems and automate tasks.`,
      'default': `This is a sample article about ${topic}. In a production environment with a valid HuggingFace API key, this would be AI-generated content. For now, it serves as placeholder content.`
    };
    
    return fallbackArticles[topic.toLowerCase()] || fallbackArticles.default;
  }
}

module.exports = new AIClient();