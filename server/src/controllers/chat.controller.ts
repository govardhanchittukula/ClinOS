import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';

export class ChatController {
  /**
   * POST /api/chat/message
   * Handle user intake message and process clinical reasoning
   */
  async handleChatMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, conversationHistory, userLocation, patientContext } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Message text is required.',
        });
        return;
      }

      const result = await chatService.processChatMessage({
        message,
        conversationHistory,
        userLocation,
        patientContext,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * GET /api/chat/prompts
   * Return suggested prompt starters and triage scenarios
   */
  async getSuggestedPrompts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        prompts: [
          {
            title: 'Abdominal Triage',
            category: 'Acute Surgery',
            prompt: 'I have severe right lower abdominal pain that started around my navel 18 hours ago, with nausea and slight fever.',
            badge: 'Urgent',
          },
          {
            title: 'Chest Pain Evaluation',
            category: 'Cardiology',
            prompt: 'I am feeling crushing central chest pressure radiating towards my left shoulder accompanied by diaphoresis.',
            badge: 'Emergency',
          },
          {
            title: 'Severe Migraine Protocol',
            category: 'Neurology',
            prompt: 'Experiencing a throbbing unilateral temporal headache with photophobia and nausea for the past 6 hours.',
            badge: 'Moderate',
          },
          {
            title: 'Respiratory & Bronchitis',
            category: 'Pulmonology',
            prompt: 'Persistent productive cough with yellow sputum, low-grade fever of 100.8 F, and wheezing on exertion.',
            badge: 'Routine',
          },
        ],
      });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
