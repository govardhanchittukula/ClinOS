import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { inMemoryDb, supabaseAdmin, isSupabaseConfigured, DbWorkflow, DbAgentLog } from '../config/supabase';
import { WorkflowInput } from '../schemas/workflow.schema';
import { runPlannerAgent, PlannerOutput } from '../agents/planner.agent';
import { runResearcherAgent, ResearcherOutput } from '../agents/researcher.agent';
import { runCriticAgent, CriticOutput } from '../agents/critic.agent';
import { runSynthesizerAgent } from '../agents/synthesizer.agent';

export interface SSELogEvent {
  id: string;
  workflowId: string;
  agentRole: 'planner' | 'researcher' | 'critic' | 'synthesizer' | 'system';
  action: string;
  payload: any;
  timestamp: string;
}

class OrchestratorService {
  private activeStreams: Map<string, Set<Response>> = new Map();
  private cancelledWorkflows: Set<string> = new Set();
  private MAX_ITERATIONS = 4; // Strict security limit to prevent infinite loops

  // Add SSE listener for a client connection
  public addSSEClient(workflowId: string, res: Response) {
    if (!this.activeStreams.has(workflowId)) {
      this.activeStreams.set(workflowId, new Set());
    }
    this.activeStreams.get(workflowId)!.add(res);

    res.on('close', () => {
      const clients = this.activeStreams.get(workflowId);
      if (clients) {
        clients.delete(res);
        if (clients.size === 0) {
          this.activeStreams.delete(workflowId);
        }
      }
    });
  }

  // Stream log event to all connected SSE clients & persist to DB
  private async emitLog(
    workflowId: string,
    agentRole: 'planner' | 'researcher' | 'critic' | 'synthesizer' | 'system',
    action: string,
    payload: any
  ) {
    const timestamp = new Date().toISOString();
    const logEvent: SSELogEvent = {
      id: uuidv4(),
      workflowId,
      agentRole,
      action,
      payload,
      timestamp,
    };

    // Send SSE message
    const clients = this.activeStreams.get(workflowId);
    if (clients) {
      const sseData = `data: ${JSON.stringify(logEvent)}\n\n`;
      clients.forEach((res) => res.write(sseData));
    }

    // Save log event in DB
    inMemoryDb.agentLogs.push({
      id: logEvent.id,
      workflow_id: workflowId,
      agent_role: agentRole === 'system' ? 'planner' : agentRole,
      action,
      payload,
      timestamp,
    });

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('agent_logs').insert({
          id: logEvent.id,
          workflow_id: workflowId,
          agent_role: agentRole === 'system' ? 'planner' : agentRole,
          action,
          payload,
          timestamp,
        });
      } catch (err) {
        console.warn('Supabase agent log insert error:', err);
      }
    }
  }

  public async cancelWorkflow(workflowId: string): Promise<boolean> {
    this.cancelledWorkflows.add(workflowId);
    await this.emitLog(workflowId, 'system', 'WORKFLOW_CANCELLED', {
      message: 'User requested safe cancellation of clinical agent execution loop.',
    });
    
    // Update DB status
    const wf = inMemoryDb.workflows.get(workflowId);
    if (wf) wf.status = 'failed';

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('workflows').update({ status: 'failed' }).eq('id', workflowId);
    }
    return true;
  }

  public async createWorkflow(input: WorkflowInput): Promise<DbWorkflow> {
    const workflowId = uuidv4();
    const now = new Date().toISOString();
    const workflow: DbWorkflow = {
      id: workflowId,
      user_id: input.userId || 'demo-physician-01',
      clinical_case: input.clinicalCase,
      status: 'pending',
      configuration: {
        complexity: input.complexity,
        enableCritic: input.enableCritic,
        outputFormat: input.outputFormat,
        temperature: input.temperature,
      },
      created_at: now,
    };

    inMemoryDb.workflows.set(workflowId, workflow);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('workflows').insert({
          id: workflow.id,
          user_id: workflow.user_id,
          clinical_case: workflow.clinical_case,
          status: workflow.status,
          configuration: workflow.configuration,
          created_at: workflow.created_at,
        });
      } catch (err) {
        console.warn('Supabase insert workflow warning:', err);
      }
    }

    // Trigger async execution state machine
    setImmediate(() => this.executeAgentStateMachine(workflowId, input));

    return workflow;
  }

  private async executeAgentStateMachine(workflowId: string, input: WorkflowInput) {
    const wf = inMemoryDb.workflows.get(workflowId);
    if (wf) wf.status = 'running';

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('workflows').update({ status: 'running' }).eq('id', workflowId);
    }

    await this.emitLog(workflowId, 'system', 'ORCHESTRATOR_START', {
      message: 'Initializing ClinOS Autonomous Agent Execution Graph.',
      configuration: input,
    });

    try {
      // Step 1: Triage Planner Agent
      if (this.cancelledWorkflows.has(workflowId)) return;
      await this.emitLog(workflowId, 'planner', 'PLANNER_THINKING', {
        step: 'Analyzing patient history, vitals, and chief complaints...',
      });

      const plannerResult: PlannerOutput = await runPlannerAgent(input.clinicalCase, input.complexity);

      await this.emitLog(workflowId, 'planner', 'PLANNER_COMPLETED', {
        summary: plannerResult.clinicalSummary,
        executionPlan: plannerResult.executionSteps,
      });

      // Step 2 & 3: Clinical Researcher & Medical Critic Loop
      let iteration = 1;
      let isSafe = false;
      let lastCriticFeedback: string | undefined = undefined;
      let researcherResult!: ResearcherOutput;
      let criticResult: CriticOutput | null = null;

      while (iteration <= this.MAX_ITERATIONS && !isSafe) {
        if (this.cancelledWorkflows.has(workflowId)) return;

        await this.emitLog(workflowId, 'researcher', 'RESEARCHER_THINKING', {
          iteration,
          message: iteration === 1
            ? 'Generating initial differential diagnoses & auditing symptom vectors...'
            : `Refining differential based on Medical Critic feedback (Iteration ${iteration})...`,
        });

        researcherResult = await runResearcherAgent(
          input.clinicalCase,
          input.temperature,
          lastCriticFeedback
        );

        await this.emitLog(workflowId, 'researcher', 'RESEARCHER_COMPLETED', {
          iteration,
          primaryDiagnosis: researcherResult.primaryDiagnosis,
          differentialsCount: researcherResult.differentialDiagnoses.length,
          redFlagsCount: researcherResult.redFlagSymptoms.length,
          researcherOutput: researcherResult,
        });

        if (!input.enableCritic) {
          await this.emitLog(workflowId, 'critic', 'CRITIC_SKIPPED', {
            message: 'Medical Critic validation node bypassed per user execution parameters.',
          });
          isSafe = true;
          break;
        }

        // Run Medical Critic (Validator)
        if (this.cancelledWorkflows.has(workflowId)) return;
        await this.emitLog(workflowId, 'critic', 'CRITIC_THINKING', {
          iteration,
          message: 'Auditing researcher conclusions against clinical safety guardrails and emergency red flags...',
        });

        criticResult = await runCriticAgent(input.clinicalCase, researcherResult, iteration);

        if (criticResult.isClinicallySafe) {
          isSafe = true;
          await this.emitLog(workflowId, 'critic', 'CRITIC_APPROVED', {
            iteration,
            riskLevel: criticResult.riskLevel,
            feedback: criticResult.feedback,
          });
        } else {
          lastCriticFeedback = criticResult.feedback;
          await this.emitLog(workflowId, 'critic', 'CRITIC_REJECTED_RETRY', {
            iteration,
            riskLevel: criticResult.riskLevel,
            feedback: criticResult.feedback,
            action: `Self-correcting loop triggered. Instructing Researcher to refine diagnostic reasoning (Attempt ${iteration + 1}/${this.MAX_ITERATIONS}).`,
          });
          iteration++;
        }
      }

      if (!isSafe && iteration > this.MAX_ITERATIONS) {
        await this.emitLog(workflowId, 'critic', 'SAFETY_CAP_HALT', {
          message: `Reached maximum retry iteration cap (${this.MAX_ITERATIONS}). Proceeding with current best validated clinical findings and strict risk warning.`,
        });
      }

      // Step 4: Care Synthesizer Agent
      if (this.cancelledWorkflows.has(workflowId)) return;
      await this.emitLog(workflowId, 'synthesizer', 'SYNTHESIZER_THINKING', {
        message: 'Compiling final structured clinical triage report, diagnostic steps, and care plan...',
      });

      const finalReport = await runSynthesizerAgent(
        input.clinicalCase,
        plannerResult,
        researcherResult,
        criticResult,
        input.outputFormat
      );

      const completedAt = new Date().toISOString();

      await this.emitLog(workflowId, 'synthesizer', 'SYNTHESIZER_COMPLETED', {
        format: input.outputFormat,
        reportPreview: finalReport.slice(0, 300) + '...',
      });

      // Update state to completed
      if (wf) {
        wf.status = 'completed';
        wf.final_output = finalReport;
        wf.completed_at = completedAt;
      }

      if (isSupabaseConfigured && supabaseAdmin) {
        await supabaseAdmin
          .from('workflows')
          .update({
            status: 'completed',
            final_output: finalReport,
            completed_at: completedAt,
          })
          .eq('id', workflowId);
      }

      await this.emitLog(workflowId, 'system', 'ORCHESTRATION_FINISHED', {
        message: 'ClinOS Autonomous Multi-Agent Triage Execution finished successfully.',
        completedAt,
      });

    } catch (error: any) {
      console.error(`Workflow ${workflowId} execution error:`, error);
      if (wf) wf.status = 'failed';

      if (isSupabaseConfigured && supabaseAdmin) {
        await supabaseAdmin.from('workflows').update({ status: 'failed' }).eq('id', workflowId);
      }

      await this.emitLog(workflowId, 'system', 'ORCHESTRATION_ERROR', {
        error: error.message || 'An unexpected multi-agent execution error occurred.',
      });
    }
  }

  public getWorkflowById(workflowId: string): DbWorkflow | undefined {
    return inMemoryDb.workflows.get(workflowId);
  }

  public getWorkflowLogs(workflowId: string): DbAgentLog[] {
    return inMemoryDb.agentLogs.filter((l) => l.workflow_id === workflowId);
  }

  public getAllWorkflows(): DbWorkflow[] {
    return Array.from(inMemoryDb.workflows.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

export const orchestratorService = new OrchestratorService();
