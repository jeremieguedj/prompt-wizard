export interface PromptField {
  key: PromptFieldKey;
  label: string;
  placeholder: string;
  description: string;
  maxXP: number;
}

export type PromptFieldKey =
  | "title"
  | "short_description"
  | "design_language"
  | "ui_elements"
  | "user_flows"
  | "user_input_logic";

export interface PromptData {
  id?: string;
  name: string;
  title: string;
  short_description: string;
  design_language: string;
  ui_elements: string;
  user_flows: string;
  user_input_logic: string;
  xp_earned: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const PROMPT_FIELDS: PromptField[] = [
  {
    key: "title",
    label: "Product Title",
    placeholder: "e.g. TaskFlow — AI-powered project management",
    description:
      "The name and tagline of your product. Be specific about what makes it unique.",
    maxXP: 100,
  },
  {
    key: "short_description",
    label: "Short Description",
    placeholder:
      "e.g. A project management tool that uses AI to predict task completion times, auto-assign team members based on skills, and generate sprint reports.",
    description:
      "A concise description of your product — what it does and who it's for.",
    maxXP: 200,
  },
  {
    key: "design_language",
    label: "Design Language",
    placeholder:
      "e.g. Minimal and clean with a blue/white color scheme. Uses rounded cards, subtle shadows, and a sans-serif font. Feels professional but approachable.",
    description:
      "Describe the visual style, colors, typography, and overall aesthetic.",
    maxXP: 200,
  },
  {
    key: "ui_elements",
    label: "UI Elements",
    placeholder:
      "e.g. Top nav with logo, search, and avatar. Sidebar with project list. Main area shows a Kanban board with draggable cards. Each card shows title, assignee avatar, priority badge, and due date.",
    description:
      "List the key UI components, layouts, navigation, and interactive elements.",
    maxXP: 200,
  },
  {
    key: "user_flows",
    label: "User Flows",
    placeholder:
      "e.g. 1) User logs in → sees dashboard with active projects. 2) Clicks 'New Project' → wizard with name, team, deadline. 3) Drags task to 'Done' → triggers confetti + XP animation.",
    description:
      "Describe the main user journeys — step by step, what happens when they interact.",
    maxXP: 200,
  },
  {
    key: "user_input_logic",
    label: "User Input & Logic",
    placeholder:
      "e.g. Task form validates title (required, max 100 chars) and deadline (must be future date). AI suggestion button sends task description to API and returns recommended assignees. Drag-and-drop updates task status via optimistic UI.",
    description:
      "Describe form validations, business rules, API interactions, and data flow.",
    maxXP: 100,
  },
];

export const DEFAULT_PROMPT_DATA: PromptData = {
  name: "",
  title: "",
  short_description: "",
  design_language: "",
  ui_elements: "",
  user_flows: "",
  user_input_logic: "",
  xp_earned: 0,
  is_active: true,
};
