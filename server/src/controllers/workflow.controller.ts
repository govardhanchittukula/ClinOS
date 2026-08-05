import { Request, Response, NextFunction } from 'express';
import { workflowInputSchema } from '../schemas/workflow.schema';
import { orchestratorService } from '../services/orchestrator.service';
import { inMemoryDb, supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

export const createWorkflowHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = workflowInputSchema.parse(req.body);
    const workflow = await orchestratorService.createWorkflow(validatedInput);

    res.status(201).json({
      success: true,
      message: 'Autonomous clinical workflow initialized successfully.',
      workflowId: workflow.id,
      workflow,
    });
  } catch (error) {
    next(error);
  }
};

export const streamWorkflowLogsHandler = (req: Request, res: Response) => {
  const { id } = req.params;

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Initial SSE handshake heartbeat
  res.write(`data: ${JSON.stringify({ type: 'HANDSHAKE', message: 'SSE Connection Established for ClinOS Stream', workflowId: id })}\n\n`);

  // Register client to orchestrator SSE listener pool
  orchestratorService.addSSEClient(id, res);

  // Send historical logs already recorded for this workflow
  const existingLogs = orchestratorService.getWorkflowLogs(id);
  existingLogs.forEach((log) => {
    res.write(`data: ${JSON.stringify({
      id: log.id,
      workflowId: log.workflow_id,
      agentRole: log.agent_role,
      action: log.action,
      payload: log.payload,
      timestamp: log.timestamp,
    })}\n\n`);
  });
};

export const cancelWorkflowHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cancelled = await orchestratorService.cancelWorkflow(id);

    res.status(200).json({
      success: true,
      message: `Workflow ${id} safe cancellation initiated.`,
      cancelled,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleWorkflowHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let workflow = orchestratorService.getWorkflowById(id);

    if (!workflow && isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('workflows').select('*').eq('id', id).single();
      if (data) workflow = data;
    }

    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow not found.' });
    }

    const logs = orchestratorService.getWorkflowLogs(id);

    res.status(200).json({
      success: true,
      workflow,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getOutputsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let workflows = orchestratorService.getAllWorkflows();

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('workflows').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) workflows = data;
    }

    const completedOutputs = workflows.filter((w) => w.status === 'completed' || w.final_output);

    res.status(200).json({
      success: true,
      count: completedOutputs.length,
      outputs: completedOutputs,
    });
  } catch (error) {
    next(error);
  }
};
