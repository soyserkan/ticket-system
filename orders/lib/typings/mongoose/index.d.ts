
declare module 'mongoose' {
  interface DocumentQuery<T, DocType extends import("mongoose").Document, QueryHelpers = {}> {
    mongooseCollection: {
      name: any;
    };
    cache(): DocumentQuery<T[], Document> & QueryHelpers;
    useCache: boolean;
    hashKey: string;
  }
  interface Document {
    generateAuthToken(): Document<User>
  }
}