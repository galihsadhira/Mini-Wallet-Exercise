import {
    AggregatePaginateModel,
    Document,
    PaginateModel,
} from 'mongoose';

export type CombinedModel<T extends Document> = PaginateModel<T> &
    AggregatePaginateModel<T>;
