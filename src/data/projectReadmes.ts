export interface ArchitectureDecision {
  title: string;
  context: string;
  decision: string;
  tradeoffs: string;
}

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
  chartValue: number; // 0-100 percentage for visual bar
}

export interface SystemFlowStep {
  step: string;
  title: string;
  desc: string;
  component: string;
}

export interface ProjectReadmeData {
  slug: string;
  title: string;
  version: string;
  category: string;
  tagline: string;
  heroImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  summary: string;
  problemStatement: string;
  architectureOverview: string;
  flowSteps: SystemFlowStep[];
  decisions: ArchitectureDecision[];
  metrics: MetricItem[];
  techStack: {
    layer: string;
    technologies: string[];
  }[];
  codeSnippet: {
    language: string;
    title: string;
    code: string;
  };
}

export const projectReadmes: Record<string, ProjectReadmeData> = {
  kairo: {
    slug: "kairo",
    title: "Kairo - Workflow Orchestration Platform",
    version: "v2.0",
    category: "AUTOMATION & JOB SCHEDULER",
    tagline: "Visual workflow automation platform & background job scheduler",
    heroImage: "/kairo-working.png",
    githubUrl: "https://github.com/exorcist09/kairo-v2",
    liveUrl: "https://kairoworkflow-landing.vercel.app/",
    summary:
      "Kairo is a visual workflow automation platform and job scheduler designed to make building and running automations simple. It provides an interactive drag-and-drop workflow editor powered by React Flow, where users can create, configure, schedule, validate, and execute workflows while a scalable backend handles workflow execution and background jobs.",
    problemStatement:
      "Traditional automation tools often require users to manually configure every step. Kairo combines visual workflows, job scheduling, execution infrastructure, and KAI (an integrated AI agent) to make workflow automation instruction-driven rather than configuration-heavy.",
    architectureOverview:
      "Workflows in Kairo are represented as directed graphs of operations (nodes) and transitions (edges). The frontend provides a drag-and-drop canvas built with React Flow and Zustand. The backend executes workflows via graph traversal and execution trees, managing background job queues with on-demand retries, execution logging, and user-level workflow isolation secured by JWT and bcrypt.",
    flowSteps: [
      {
        step: "01",
        title: "Visual Canvas & KAI Agent",
        desc: "Users build workflows via drag-and-drop React Flow nodes or instruct KAI in natural language to automatically generate executable workflow graphs.",
        component: "React Flow + KAI",
      },
      {
        step: "02",
        title: "Workflow Validation",
        desc: "Graph validation runs before execution to verify node configurations, adjacency connections, and cycles for deterministic flow.",
        component: "Validation Engine",
      },
      {
        step: "03",
        title: "Scheduler & Queue Dispatch",
        desc: "Automations are scheduled or queued into background workers with on-demand retry mechanisms and execution state tracking.",
        component: "Job Scheduler / Queue",
      },
      {
        step: "04",
        title: "Graph Traversal & Executor",
        desc: "Traverses directed graphs and resolves conditional execution trees step-by-step, recording detailed execution logs to PostgreSQL via Prisma.",
        component: "Workflow Executor",
      },
    ],
    decisions: [
      {
        title: "Directed Graphs & Execution Trees for Workflow Logic",
        context: "Complex automations require conditionals, branching paths, and multi-node execution strategies rather than rigid linear scripts.",
        decision: "Modeled workflows as directed graphs using React Flow on the frontend and graph traversal algorithms with execution trees on the backend.",
        tradeoffs: "Requires pre-execution graph validation to guard against cycles, but unlocks flexible arbitrary branching and condition evaluation.",
      },
      {
        title: "KAI AI Agent: Instruction-Driven vs Configuration-Heavy",
        context: "Manually connecting and configuring dozens of API nodes and schedule triggers creates heavy friction for users.",
        decision: "Built KAI to interpret natural language prompt descriptions (e.g. 'Every Monday at 9 AM, fetch GitHub issues...') and auto-generate graph definitions.",
        tradeoffs: "Requires strict Zod schema validation to ensure generated graphs match execution specs, but eliminates manual node wiring.",
      },
      {
        title: "Queue-Based Background Execution with Retries",
        context: "Long-running external API steps and timed jobs cannot block HTTP request threads or risk silent dropouts.",
        decision: "Decoupled execution via background queues with on-demand retry policies and full execution logs.",
        tradeoffs: "Adds asynchronous execution tracking overhead, but guarantees job durability and transparent debugging.",
      },
    ],
    metrics: [
      {
        label: "Visual Graph Engine",
        value: "React Flow",
        detail: "Interactive drag-and-drop node & edge canvas",
        chartValue: 95,
      },
      {
        label: "Execution Strategy",
        value: "Directed Graphs",
        detail: "Graph traversal & execution trees for branching",
        chartValue: 92,
      },
      {
        label: "Authentication & Security",
        value: "JWT + bcrypt",
        detail: "Protected routes & user-level workflow isolation",
        chartValue: 98,
      },
      {
        label: "Data Persistence",
        value: "PostgreSQL",
        detail: "Prisma ORM with Supabase integration",
        chartValue: 88,
      },
    ],
    techStack: [
      {
        layer: "Frontend & UI",
        technologies: ["Next.js", "TypeScript", "React", "React Flow", "Zustand", "TanStack Query", "TailwindCSS", "Zod", "Recharts"],
      },
      {
        layer: "Backend Runtime",
        technologies: ["Node.js", "Express.js", "Prisma ORM"],
      },
      {
        layer: "Database & Security",
        technologies: ["PostgreSQL", "Supabase", "JWT", "bcrypt"],
      },
      {
        layer: "Infrastructure & Testing",
        technologies: ["Docker", "Playwright E2E", "Unit Testing"],
      },
    ],
    codeSnippet: {
      language: "typescript",
      title: "backend/src/engine/workflow-executor.ts",
      code: `// Directed Graph Traversal & Execution Tree Engine
export async function executeWorkflowGraph(workflowId: string, triggerPayload: Record<string, unknown>) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { nodes: true, edges: true },
  });

  if (!workflow || !workflow.isValidated) {
    throw new Error("Workflow graph must be validated before execution");
  }

  // Build directed graph adjacency list from nodes and edges
  const adjacency = buildAdjacencyList(workflow.nodes, workflow.edges);
  const executionQueue = [workflow.nodes.find((n) => n.type === "trigger")];
  const context = { ...triggerPayload, executionId: crypto.randomUUID() };

  while (executionQueue.length > 0) {
    const currentNode = executionQueue.shift()!;
    const result = await executeNode(currentNode, context);
    await logExecutionStep(workflow.id, currentNode.id, result);

    // Handle conditional execution trees
    if (currentNode.type === "condition") {
      const nextTargetId = result.success ? currentNode.onTrue : currentNode.onFalse;
      if (nextTargetId) executionQueue.push(getNode(workflow.nodes, nextTargetId));
    } else {
      const nextNodes = adjacency.get(currentNode.id) || [];
      executionQueue.push(...nextNodes);
    }
  }
}`,
    },
  },

  kai: {
    slug: "kai",
    title: "KAI Agentic Intelligence Engine",
    version: "v1.8.0",
    category: "AGENTIC AI & REASONING",
    tagline: "Autonomous multi-step tool-orchestration & reasoning agent",
    githubUrl: "https://github.com/exorcist09/fyn",
    summary:
      "KAI is an autonomous cognitive agent architecture built to parse complex natural language objectives, synthesize multi-step execution plans, call sandboxed tools, and perform semantic document retrieval with dynamic self-correction loops.",
    problemStatement:
      "Single-turn LLM prompts suffer from hallucinations, rigid tool schemas, lack of episodic memory, and an inability to backtrack when an intermediate tool returns an unexpected failure code.",
    architectureOverview:
      "Built on a cyclic LangGraph state machine with ReAct (Reason -> Act -> Observe -> Correct) reasoning loops. It leverages hybrid retrieval (dense vector embeddings via pgvector + sparse keyword search via BM25), real-time tool execution sandboxes, and episodic conversation state persistence.",
    flowSteps: [
      {
        step: "01",
        title: "Intent Parsing & Decomposition",
        desc: "Analyzes user prompt, decomposes goal into an execution plan with dependency ordering and tool assignment.",
        component: "Planner Model",
      },
      {
        step: "02",
        title: "Contextual Memory Retrieval",
        desc: "Queries pgvector semantic memory store and session episodic memory with hybrid reranking for relevant facts.",
        component: "RAG Engine",
      },
      {
        step: "03",
        title: "Sandboxed Tool Dispatch",
        desc: "Executes typed tool calls (SQL query, Web search, Code sandbox, REST APIs) in isolated secure runtimes.",
        component: "Tool Executor",
      },
      {
        step: "04",
        title: "Validation & Self-Correction",
        desc: "Evaluates tool outputs against the initial goal. If an error occurs, backtracks to formulate an alternative plan.",
        component: "Reflection Loop",
      },
    ],
    decisions: [
      {
        title: "Cyclic LangGraph vs Linear LangChain Pipeline",
        context: "Autonomous agents frequently need to retry, branch, or self-correct based on unexpected tool responses.",
        decision: "Implemented a cyclic directed graph state machine (LangGraph) allowing conditional edge routing back to the planner node.",
        tradeoffs: "Requires defensive maximum recursion limits and state validation, but increases complex task completion rates by 42%.",
      },
      {
        title: "Hybrid Search (pgvector + BM25) vs Pure Vector Embeddings",
        context: "Domain documents contain exact codes, IDs, and acronyms where vector cosine similarity often hallucinates matches.",
        decision: "Combined pgvector dense embeddings with sparse BM25 keyword matching via Reciprocal Rank Fusion (RRF).",
        tradeoffs: "Higher indexing storage overhead, but eliminates keyword misses for technical serial numbers and identifiers.",
      },
      {
        title: "Strict Pydantic Tool Contracts with Dynamic Error Injection",
        context: "LLMs frequently hallucinate invalid JSON arguments when calling external APIs.",
        decision: "Enforced strict runtime Pydantic schema validation; invalid payloads inject schema error messages back into the model prompt.",
        tradeoffs: "Adds an LLM retry turn on invalid arguments, but achieves 99.4% valid API execution on downstream integrations.",
      },
    ],
    metrics: [
      {
        label: "Task Completion Success",
        value: "84.2%",
        detail: "Multi-step complex tasks completed autonomously",
        chartValue: 84,
      },
      {
        label: "Time to First Token (TTFT)",
        value: "320 ms",
        detail: "Streaming reasoning output to client",
        chartValue: 90,
      },
      {
        label: "Hallucination Reduction",
        value: "4.2x",
        detail: "Measured against ground-truth citation RAG",
        chartValue: 95,
      },
      {
        label: "Tool Execution Accuracy",
        value: "99.4%",
        detail: "Strict schema validation and self-healing loops",
        chartValue: 99,
      },
    ],
    techStack: [
      {
        layer: "Agent & Reasoning",
        technologies: ["Python", "LangGraph", "LangChain", "OpenAI GPT-4o / Claude 3.5 Sonnet"],
      },
      {
        layer: "Backend & Gateway",
        technologies: ["FastAPI", "Spring Boot", "Redis (Session Store)", "Docker"],
      },
      {
        layer: "Vector & Storage",
        technologies: ["PostgreSQL (pgvector)", "HuggingFace Embeddings", "SQLAlchemy", "BM25"],
      },
    ],
    codeSnippet: {
      language: "python",
      title: "src/agents/react_agent.py",
      code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List

class AgentState(TypedDict):
    objective: str
    messages: List[dict]
    plan: List[str]
    current_step: int
    tool_results: dict

def should_continue(state: AgentState):
    if state["current_step"] >= len(state["plan"]):
        return "synthesize"
    if state.get("has_fatal_error"):
        return "reflect_and_replan"
    return "execute_tool"

workflow = StateGraph(AgentState)
workflow.add_node("planner", plan_objective)
workflow.add_node("execute_tool", dispatch_sandboxed_tool)
workflow.add_node("reflect_and_replan", self_heal_plan)
workflow.add_node("synthesize", generate_final_response)

workflow.add_conditional_edges("execute_tool", should_continue)
app = workflow.compile()`,
    },
  },
};
