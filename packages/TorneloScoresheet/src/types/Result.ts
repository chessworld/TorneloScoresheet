export type Result<S> = Success<S> | Failure;

export enum ResultVariant {
  SuccessType,
  FailureType,
}

export type Success<DataType> = {
  type: ResultVariant.SuccessType;
  data: DataType;
};

export type Failure = {
  type: ResultVariant.FailureType;
  error: string;
};

export const succ = <T>(data: T): Success<T> => ({
  type: ResultVariant.SuccessType,
  data,
});

export const fail = (error: string): Failure => ({
  type: ResultVariant.FailureType,
  error,
});

export const isError = <T>(result: Result<T>): result is Failure =>
  result.type === ResultVariant.FailureType;
