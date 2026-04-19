import apiEvolution from '@/services/core/apiEvolution';
import {
  KnowledgeBase,
  CreateKnowledgeBaseRequest,
  UpdateKnowledgeBaseRequest,
} from '@/types/knowledge/knowledge';

class KnowledgeService {
  private normalizeKnowledgeBases(data: unknown): KnowledgeBase[] {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      const candidate = (data as { knowledgeBases?: unknown; data?: unknown }).knowledgeBases
        ?? (data as { knowledgeBases?: unknown; data?: unknown }).data;
      if (Array.isArray(candidate)) {
        return candidate as KnowledgeBase[];
      }
    }
    return [];
  }

  private normalizeAgentLinks(data: unknown): { agentId: string }[] {
    if (Array.isArray(data)) {
      return data as { agentId: string }[];
    }
    if (data && typeof data === 'object') {
      const candidate = (data as { agents?: unknown; data?: unknown }).agents
        ?? (data as { agents?: unknown; data?: unknown }).data;
      if (Array.isArray(candidate)) {
        return candidate as { agentId: string }[];
      }
    }
    return [];
  }

  /**
   * List all knowledge bases
   */
  async listKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await apiEvolution.get('/knowledge-base');
    return this.normalizeKnowledgeBases(response.data);
  }

  /**
   * Get a single knowledge base by ID
   */
  async getKnowledgeBase(knowledgeId: string): Promise<KnowledgeBase> {
    const response = await apiEvolution.get(`/knowledge-base/${knowledgeId}`);
    return response.data;
  }

  /**
   * Create a new knowledge base
   */
  async createKnowledgeBase(data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const response = await apiEvolution.post('/knowledge-base', data);
    return response.data;
  }

  /**
   * Update an existing knowledge base
   */
  async updateKnowledgeBase(knowledgeId: string, data: UpdateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const response = await apiEvolution.put(`/knowledge-base/${knowledgeId}`, data);
    return response.data;
  }

  /**
   * Delete a knowledge base
   */
  async deleteKnowledgeBase(knowledgeId: string): Promise<void> {
    await apiEvolution.delete(`/knowledge-base/${knowledgeId}`);
  }

  /**
   * Upload a document (creates a new knowledge base from file)
   */
  async uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<KnowledgeBase> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiEvolution.post('/knowledge-base/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.knowledgeBase;
  }

  /**
   * Search knowledge bases
   */
  async searchKnowledge(query: string, limit: number = 10): Promise<KnowledgeBase[]> {
    const response = await apiEvolution.post('/knowledge-base/search', { query, limit });
    return this.normalizeKnowledgeBases(response.data);
  }

  /**
   * Get knowledge bases linked to an agent
   */
  async getAgentKnowledgeBases(agentId: string): Promise<KnowledgeBase[]> {
    const response = await apiEvolution.get(`/agent/${agentId}/knowledge-bases`);
    return this.normalizeKnowledgeBases(response.data);
  }

  /**
   * Link a knowledge base to an agent
   */
  async linkToAgent(agentId: string, knowledgeBaseId: string): Promise<void> {
    await apiEvolution.post(`/agent/${agentId}/knowledge-bases`, { knowledgeBaseId });
  }

  /**
   * Unlink a knowledge base from an agent
   */
  async unlinkFromAgent(agentId: string, knowledgeBaseId: string): Promise<void> {
    await apiEvolution.delete(`/agent/${agentId}/knowledge-bases/${knowledgeBaseId}`);
  }

  /**
   * Get agents linked to a knowledge base
   */
  async getKnowledgeBaseAgents(knowledgeBaseId: string): Promise<{ agentId: string }[]> {
    const response = await apiEvolution.get(`/knowledge-base/${knowledgeBaseId}/agents`);
    return this.normalizeAgentLinks(response.data);
  }
}

export const knowledgeService = new KnowledgeService();

// Export individual functions for backward compatibility
export const listKnowledgeBases = () =>
  knowledgeService.listKnowledgeBases();

export const getKnowledgeBase = (knowledgeId: string) =>
  knowledgeService.getKnowledgeBase(knowledgeId);

export const createKnowledgeBase = (data: CreateKnowledgeBaseRequest) =>
  knowledgeService.createKnowledgeBase(data);

export const updateKnowledgeBase = (knowledgeId: string, data: UpdateKnowledgeBaseRequest) =>
  knowledgeService.updateKnowledgeBase(knowledgeId, data);

export const deleteKnowledgeBase = (knowledgeId: string) =>
  knowledgeService.deleteKnowledgeBase(knowledgeId);

export const uploadDocument = (file: File, onProgress?: (progress: number) => void) =>
  knowledgeService.uploadDocument(file, onProgress);

export const searchKnowledge = (query: string, limit?: number) =>
  knowledgeService.searchKnowledge(query, limit);

export const linkToAgent = (agentId: string, knowledgeBaseId: string) =>
  knowledgeService.linkToAgent(agentId, knowledgeBaseId);

export const unlinkFromAgent = (agentId: string, knowledgeBaseId: string) =>
  knowledgeService.unlinkFromAgent(agentId, knowledgeBaseId);

export const getAgentKnowledgeBases = (agentId: string) =>
  knowledgeService.getAgentKnowledgeBases(agentId);

export const getKnowledgeBaseAgents = (knowledgeBaseId: string) =>
  knowledgeService.getKnowledgeBaseAgents(knowledgeBaseId);
