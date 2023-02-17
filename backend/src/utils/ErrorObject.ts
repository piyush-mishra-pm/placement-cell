export default class ErrorObject extends Error {
    statusCode: number;
    code: number;
    data: any;

    constructor(statusCode: number, message: string | undefined = undefined, data: any = {}) {
        // Add custom "message" for the Error Object:
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        // Sets Error name:
        this.name = Error.name;

        // Adds a "code" property:
        this.statusCode = statusCode;
        this.code = statusCode;

        // Custom data field:
        this.data = data;

        Error.captureStackTrace(this);
    }
}