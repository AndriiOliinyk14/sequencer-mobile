import {MMKV} from 'react-native-mmkv';
import {Project} from '../../types';
class ProjectStorageService {
  private storage: MMKV;
  private id = 'sequencer-test';
  private projectsKey = 'projects';

  constructor() {
    this.storage = new MMKV({id: this.id});
  }

  async createProject(
    data: Pick<Project, 'id' | 'name' | 'bpm' | 'patternLength'>,
  ) {
    try {
      const key = `${this.projectsKey}.${data.id}`;

      const project: Project = {
        ...data,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        patterns: {},
        samples: [],
      };

      if (await this.checkOnExistProject(key)) {
        throw `Project "${data.name}" already exist`;
      }

      this.storage.set(key, JSON.stringify(project));
    } catch (error) {
      throw error;
    }
  }

  async saveProject(id: string, data: Partial<Project>) {
    try {
      const key = `${this.projectsKey}.${id}`;

      data.updatedAt = new Date(Date.now());

      if (!(await this.checkOnExistProject(key))) {
        throw `Project "${data.name}" doesn't exist`;
      }

      this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: string) {
    try {
      const key = `${this.projectsKey}.${id}`;
      await this.storage.delete(key);
    } catch (error) {
      throw error;
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const key = `${this.projectsKey}.${id}`;
      const project = this.storage.getString(key);

      if (project) {
        return JSON.parse(project);
      }
    } catch (error) {}
  }

  async getProjectIds(): Promise<string[] | undefined> {
    try {
      const allKeys = this.storage.getAllKeys();

      const filtered = allKeys
        .map(key => {
          if (key.includes('projects')) {
            return key.replace('projects.', '');
          }
        })
        .filter(item => typeof item !== 'undefined');

      return filtered;
    } catch (error) {}
  }

  async getAllProjects() {
    try {
      const projectIds = await this.getProjectIds();

      const projects: Project[] = [];

      if (!projectIds) {
        return [];
      }

      for (const id of projectIds) {
        const project = await this.getProject(id);

        if (project) {
          projects.push(project);
        }
      }

      projects.sort((a, b) => {
        if (a.updatedAt >= b.updatedAt) {
          return -1;
        } else if (a.updatedAt <= b.updatedAt) {
          return 1;
        } else {
          0;
        }
      });

      return projects;
    } catch (error) {
      console.error('ProjectStorageService.getAllProjects', error);
    }
  }

  async checkOnExistProject(id: string) {
    try {
      const allKeys = await this.storage.getAllKeys();
      return allKeys.some(key => key === id);
    } catch (error) {}
  }
}

export const projectStorageService = new ProjectStorageService();
