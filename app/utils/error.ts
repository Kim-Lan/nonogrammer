export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof (error as Record<string, string>).message === 'string'
  );
}

export function isErrorWithDataMessage(error: unknown): error is { data: { message: string } } {
  return (
    error !== null
    && typeof error === 'object'
    && 'data' in error
    && isErrorWithMessage(error.data)
  );
}
