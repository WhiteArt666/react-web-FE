import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Bot, User, Loader2 } from 'lucide-react';
import { groqService } from '../../services/groqService';
import { courseService } from '../../services/courseService';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import './chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  courses?: any[];
}

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Chào bạn! Tôi là EduBot 🤖 - trợ lý AI tư vấn khóa học của nền tảng. Tôi có thể giúp bạn:\n\n✅ Tìm kiếm khóa học phù hợp\n✅ Tư vấn lộ trình học tập\n✅ Giải đáp thắc mắc về các khóa học\n\nBạn muốn tìm hiểu về lĩnh vực nào hôm nay?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Gợi ý khóa học phù hợp cho tôi",
    "Khóa học lập trình nào tốt nhất?",
    "Tôi muốn học về AI/Machine Learning",
    "Khóa học thiết kế UI/UX có gì hay?",
    "Học marketing online ở đâu?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatResponse = async (userMessage: string): Promise<string> => {
    try {
      const prompt = `
Bạn là một AI assistant chuyên tư vấn khóa học trực tuyến tên là "EduBot". Hãy trả lời câu hỏi sau một cách thân thiện và hữu ích:

Câu hỏi người dùng: "${userMessage}"

Hướng dẫn trả lời:
1. Trả lời bằng tiếng Việt với giọng điệu thân thiện, chuyên nghiệp
2. Tự giới thiệu là EduBot - trợ lý AI tư vấn khóa học
3. Nếu được hỏi về khóa học cụ thể:
   - Giải thích lợi ích của khóa học đó
   - Đề xuất đối tượng phù hợp
   - Gợi ý các khóa học liên quan
4. Nếu được hỏi "gợi ý khóa học" hoặc "học gì":
   - Hỏi ngược về sở thích/mục tiêu của người dùng
   - Đưa ra gợi ý dựa trên các lĩnh vực phổ biến
5. Nếu được hỏi về chủ đề khác (không liên quan đến học tập):
   - Lịch sự từ chối và hướng dẫn về các chủ đề khóa học
6. Câu trả lời nên ngắn gọn, dễ hiểu (100-250 từ)
7. Kết thúc bằng câu hỏi để tiếp tục cuộc trò chuyện

Danh sách khóa học hiện có:
📚 Lập trình:
- React và TypeScript từ cơ bản đến nâng cao
- JavaScript ES6+ và Modern Development

🤖 Khoa học dữ liệu:
- Machine Learning cho người mới bắt đầu

🎨 Thiết kế:
- UI/UX Design với Figma

📈 Marketing:
- Digital Marketing và SEO toàn diện

💼 Kinh doanh:
- Quản lý kinh doanh và lãnh đạo

☁️ Công nghệ:
- Cloud Computing và AWS
- Cybersecurity và An toàn thông tin

Hãy trả lời một cách tự nhiên và hữu ích!
`;

      const completion = await groqService.chatCompletion(prompt);
      return completion || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Bạn có thể hỏi tôi về các khóa học hoặc lĩnh vực bạn quan tâm không?';
    } catch (error) {
      console.error('Error generating chat response:', error);
      return 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn. Tôi là EduBot - trợ lý AI tư vấn khóa học. Bạn có thể hỏi tôi về các khóa học lập trình, thiết kế, marketing, hay bất kỳ lĩnh vực nào bạn quan tâm!';
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowQuickQuestions(false);

    try {
      // Delay nhỏ để tạo hiệu ứng typing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await generateChatResponse(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Nếu câu hỏi liên quan đến gợi ý khóa học, tự động gợi ý
      if (messageText.toLowerCase().includes('gợi ý') || 
          messageText.toLowerCase().includes('khóa học') || 
          messageText.toLowerCase().includes('học gì')) {
        
        setTimeout(async () => {
          try {
            const aiRecommendations = await courseService.getAIRecommendations('default-user');
            if (aiRecommendations.success && aiRecommendations.data.length > 0) {            const courses = await courseService.getAllCourses();
            const recommendedCourses = courses.data.filter((course: any) => 
              aiRecommendations.data.some(rec => rec.courseId === course.id)
            ).slice(0, 3);

              if (recommendedCourses.length > 0) {
                const courseMessage: Message = {
                  id: (Date.now() + 2).toString(),
                  text: '📚 Dưới đây là một số khóa học tôi gợi ý cho bạn:',
                  sender: 'bot',
                  timestamp: new Date(),
                  courses: recommendedCourses,
                };
                setMessages(prev => [...prev, courseMessage]);
              }
            }
          } catch (error) {
            console.error('Error fetching course recommendations:', error);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className={`chatbot-container ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle h-14 w-14 rounded-full text-white shadow-lg transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="chatbot-window w-96 h-96 flex flex-col bg-white border-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI Tư vấn khóa học</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-blue-600 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-500" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.courses && (
                        <div className="mt-3 space-y-2">
                          {message.courses.map((course) => (
                            <div
                              key={course.id}
                              className="course-card-hover bg-white p-3 rounded-lg border border-gray-200 text-gray-800 cursor-pointer"
                            >
                              <h4 className="font-semibold text-sm mb-1 text-blue-600">{course.title}</h4>
                              <p className="text-xs text-gray-600 mb-2">👨‍🏫 {course.instructor}</p>
                              <div className="flex justify-between items-center text-xs">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {course.level === 'beginner' ? 'Cơ bản' : 
                                   course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                                </span>
                                <span className="font-semibold text-green-600">
                                  {formatPrice(course.price)}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span>⭐ {course.rating}</span>
                                <span className="mx-1">•</span>
                                <span>{course.reviewCount} đánh giá</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <div className="flex space-x-1 items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm typing-animation">Đang soạn tin...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {showQuickQuestions && messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Câu hỏi gợi ý:</p>
              <div className="space-y-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi về khóa học..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendClick}
                disabled={!inputText.trim() || isTyping}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
