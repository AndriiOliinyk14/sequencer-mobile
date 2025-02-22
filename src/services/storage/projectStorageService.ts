import {MMKV} from 'react-native-mmkv';
class ProjectStorageService {
  private storage: MMKV;
  private id = 'sequencer-test';

  constructor() {
    this.storage = new MMKV({id: this.id});
  }

  async createProject(name: string, data: any) {
    try {
      const key = `projects.${name}`;

      if (await this.checkOnExistProject(key)) {
        throw `Project "${name}" already exist`;
      }

      this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async saveProject(name: string, data: any) {
    try {
      const key = `projects.${name}`;

      if (!(await this.checkOnExistProject(key))) {
        throw `Project "${name}" doesn't exist`;
      }

      this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(name: string) {
    try {
      const key = `projects.${name}`;
      this.storage.delete(key);
    } catch (error) {
      throw error;
    }
  }

  async getProject(name: string) {
    try {
      const key = `projects.${name}`;
      const project = this.storage.getString(key);

      if (project) {
        return JSON.parse(project);
      }
    } catch (error) {}
  }

  async getProjectNames(): Promise<string[] | undefined> {
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

  async checkOnExistProject(name: string) {
    try {
      const allKeys = this.storage.getAllKeys();
      return allKeys.some(key => key === name);
    } catch (error) {}
  }
}

export const projectStorageService = new ProjectStorageService();
