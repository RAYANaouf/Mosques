import { GoogleGenAI, Type } from "@google/genai";
import { Student, Group, CalendarEvent } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGroupsWithAI = async (
  students: Student[], 
  criteria: string
): Promise<{ groups: Group[], reasoning: string }> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    I have the following students:
    ${JSON.stringify(students.map(s => ({ id: s.id, name: s.name, grade: s.grade, interests: s.interests })))}

    Please create student groups based on this criteria: "${criteria}".
    Return a list of groups with a name, description, and the list of student IDs assigned to that group.
    Also provide a short reasoning for the grouping strategy.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          groups: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                studentIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["name", "description", "studentIds"]
            }
          },
          reasoning: { type: Type.STRING }
        },
        required: ["groups", "reasoning"]
      }
    }
  });

  if (response.text) {
    const result = JSON.parse(response.text);
    // Add IDs to groups since AI generates structure, not unique react keys
    const groupsWithIds = result.groups.map((g: any) => ({
      ...g,
      id: crypto.randomUUID()
    }));
    return { groups: groupsWithIds, reasoning: result.reasoning };
  }
  
  throw new Error("Failed to generate groups");
};

export const generateScheduleWithAI = async (
  groups: Group[],
  focusArea: string
): Promise<{ events: CalendarEvent[], reasoning: string }> => {
  if (!apiKey) throw new Error("API Key missing");

  // Get current week start for context
  const today = new Date();
  const prompt = `
    I have the following groups:
    ${JSON.stringify(groups.map(g => ({ id: g.id, name: g.name })))}

    Today is ${today.toDateString()}.
    Create a schedule of 3-5 distinct events for the upcoming week starting tomorrow based on this focus: "${focusArea}".
    Events should be between 8 AM and 4 PM.
    Return the events with title, start time (ISO string), duration in minutes, and assigned group ID (optional).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                startTime: { type: Type.STRING, description: "ISO 8601 Date String" },
                durationMinutes: { type: Type.INTEGER },
                groupId: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['class', 'meeting', 'activity'] }
              },
              required: ["title", "startTime", "durationMinutes", "type"]
            }
          },
          reasoning: { type: Type.STRING }
        },
        required: ["events", "reasoning"]
      }
    }
  });

  if (response.text) {
    const result = JSON.parse(response.text);
    const eventsWithIds = result.events.map((e: any) => ({
      ...e,
      id: crypto.randomUUID()
    }));
    return { events: eventsWithIds, reasoning: result.reasoning };
  }

  throw new Error("Failed to generate schedule");
};