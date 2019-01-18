import * as Interfaces from '../interfaces/index';
import { BaseModel } from './base_model';
import { BulkUpdateKeysParams } from '../interfaces/bulk_update_key';

export class Keys extends BaseModel {
  protected static rootElementName:string = 'keys';
  protected static prefixURI:string = 'projects/{!:project_id}/keys/{:id}';
  public key_id: number;
  public created_at: string;
  public key_name: string;
  public filenames: object;
  public description: string;
  public platforms: string[];
  public tags: string[];
  public comments: object;
  public screenshots: object;
  public translations: object|object[];
  public is_plural: boolean;
  public plural_name: string;
  public is_hidden: boolean;
  public is_archived: boolean;
  public context: string;
  public base_words: number;
  public char_limit: number;
  public custom_attributes: any[];

  bulk_update(project_id: string, keys: BulkUpdateKeysParams) {
    this.createPromise('PUT', { project_id: project_id }, this.returnBareJSON, 
                       this.returnBareJSON, keys, 'projects/{!:project_id}/keys');
  }
}