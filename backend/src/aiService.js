// backend/src/aiService.js
class AIService {
  constructor() {
    console.log('🤖 AI Service initialized (Mock mode)');
  }

  async generateArticle(topic) {
    console.log(`📝 Generating mock article for: ${topic}`);
    
    // Datos mock para desarrollo
    const mockArticles = {
      'Artificial Intelligence': {
        title: 'The Future of Artificial Intelligence',
        content: `Artificial Intelligence (AI) is revolutionizing industries across the globe. From healthcare to finance, AI technologies are enabling new capabilities and efficiencies previously unimaginable.

        ## Key Areas of AI Impact
        
        1. **Machine Learning**: Algorithms that improve through experience
        2. **Natural Language Processing**: Understanding human language
        3. **Computer Vision**: Interpreting visual information
        4. **Robotics**: Intelligent automation
        
        The future promises even more integration of AI into daily life, making systems smarter and more responsive to human needs.`,
        excerpt: 'Exploring how AI is transforming industries and what the future holds for intelligent systems.'
      },
      'Web Development': {
        title: 'Modern Web Development Trends 2024',
        content: `Web development continues to evolve rapidly, with new frameworks, tools, and methodologies emerging constantly.

        ## Current Trends
        
        ### 1. **Jamstack Architecture**
        - Static site generation
        - CDN distribution
        - API-driven functionality
        
        ### 2. **Serverless Computing**
        - Reduced infrastructure management
        - Pay-per-use pricing
        - Automatic scaling
        
        ### 3. **Progressive Web Apps (PWAs)**
        - Offline functionality
        - Native app-like experience
        - Push notifications
        
        Developers today need to stay adaptable and continuously learn to keep up with these changes.`,
        excerpt: 'An overview of the latest trends and technologies shaping web development today.'
      },
      'Cloud Computing': {
        title: 'Cloud Computing: Benefits and Challenges',
        content: `Cloud computing has become the backbone of modern digital infrastructure, offering scalable resources on demand.

        ## Benefits
        
        - **Scalability**: Resources can be scaled up or down as needed
        - **Cost Efficiency**: Pay only for what you use
        - **Reliability**: High availability and redundancy
        - **Global Reach**: Deploy applications worldwide
        
        ## Challenges
        
        - **Security Concerns**: Data protection and compliance
        - **Vendor Lock-in**: Difficulty migrating between providers
        - **Cost Management**: Unexpected expenses if not monitored
        
        Understanding both benefits and challenges is crucial for effective cloud adoption.`,
        excerpt: 'Examining the advantages and potential pitfalls of cloud computing adoption.'
      }
    };

    // Retornar artículo mock o uno genérico
    if (mockArticles[topic]) {
      return mockArticles[topic];
    }

    // Artículo genérico si el tema no está en la lista
    return {
      title: `Understanding ${topic}`,
      content: `This article explores the fascinating world of ${topic}. 

      ## Introduction
      
      ${topic} is a field that has seen tremendous growth and innovation in recent years. This article aims to provide a comprehensive overview of its key concepts and applications.
      
      ## Key Concepts
      
      1. **Fundamental Principles**: The basic ideas that underpin ${topic}
      2. **Practical Applications**: How ${topic} is used in real-world scenarios
      3. **Future Developments**: Where the field is heading
      
      ## Conclusion
      
      ${topic} continues to evolve and offer new opportunities for innovation and problem-solving across various industries.`,
      excerpt: `A comprehensive look at ${topic} and its impact on modern technology.`
    };
  }
}

module.exports = new AIService();