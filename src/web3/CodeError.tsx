export class CodeError extends Error {
  constructor(code: number, title: string, message: string, stack?: string | undefined) {
    super(message);
    this.status = code;
    this.name = title;
    this.message = message;
    this.stack = stack;
  }
  public status: number;
  public name: string;
  public message: string;
  public stack: string | undefined;
}
