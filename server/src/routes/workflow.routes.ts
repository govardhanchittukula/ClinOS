import { Router } from 'express';
import {
  createWorkflowHandler,
  streamWorkflowLogsHandler,
  cancelWorkflowHandler,
  getSingleWorkflowHandler,
  getOutputsHandler,
} from '../controllers/workflow.controller';

const router = Router();

// POST /api/workflows - Initialize a new clinical agent workflow
router.post('/workflows', createWorkflowHandler);

// GET /api/workflows/:id/stream - SSE real-time agent thought log stream
router.get('/workflows/:id/stream', streamWorkflowLogsHandler);

// POST /api/workflows/:id/cancel - Safe halt/cancel active loop
router.post('/workflows/:id/cancel', cancelWorkflowHandler);

// GET /api/workflows/:id - Fetch single workflow detail and logs
router.get('/workflows/:id', getSingleWorkflowHandler);

// GET /api/outputs - Retrieve paginated historical outputs
router.get('/outputs', getOutputsHandler);

export default router;
