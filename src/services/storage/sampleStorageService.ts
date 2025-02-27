import {MMKV} from 'react-native-mmkv';
import {SampleEntity} from '../../types';

class SampleStorageService {
  private storage: MMKV;
  private id = 'sequencer-samples';

  constructor() {
    this.storage = new MMKV({id: this.id});
  }

  async save(data: SampleEntity) {
    try {
      this.storage.set(data.id, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async update(data: SampleEntity) {
    try {
      await this.remove(data);
      this.storage.set(data.id, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  async remove(data: SampleEntity) {
    try {
      await this.storage.delete(data.id);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async get(id: string): Promise<SampleEntity | undefined> {
    try {
      const sample = this.storage.getString(id);

      if (sample) {
        const parsedData = JSON.parse(sample) as SampleEntity;
        return parsedData;
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

      for (const key of allKeys) {
        const sampleData = await this.get(key);

        if (sampleData) {
          data.push(sampleData);
        }
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const sampleStorageService = new SampleStorageService();
