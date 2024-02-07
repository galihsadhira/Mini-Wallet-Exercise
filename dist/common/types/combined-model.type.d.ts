import { AggregatePaginateModel, Document, PaginateModel } from 'mongoose';
export declare type CombinedModel<T extends Document> = PaginateModel<T> & AggregatePaginateModel<T>;
