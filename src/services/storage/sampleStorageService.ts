import {MMKV} from 'react-native-mmkv';
import {SampleEntity} from '../../types';
import uuid from 'react-native-uuid';

class SampleStorageService {
  private storage: MMKV;
  private id = 'sequencer-samples';

  constructor() {
    this.storage = new MMKV({id: this.id});
  }

  async save(data: SampleEntity) {
    try {
      const key = uuid.v4();

      this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      this.storage.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async get(id: string) {
    try {
      const project = this.storage.getString(id);

      if (project) {
        return JSON.parse(project);
      }
    } catch (error) {
      throw error;
    }
  }

  async getIds(): Promise<string[] | undefined> {
    try {
      const allKeys = this.storage.getAllKeys();
      return allKeys;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<SampleEntity[] | undefined> {
    try {
      const allKeys = this.storage.getAllKeys();
      const data: SampleEntity[] = [];

      allKeys.forEach(key => {
        const sampleData = this.storage.getString(key);

        if (sampleData) {
          data.push(JSON.parse(sampleData));
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const sampleStorageService = new SampleStorageService();
