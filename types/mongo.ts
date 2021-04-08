export type MongoResponse = Object | Array<any>;

export interface CollectionConfig {
  secondaryIndices?: Array<string>;
}
