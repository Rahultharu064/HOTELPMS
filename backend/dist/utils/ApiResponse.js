"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    errors;
    constructor(success, message, data = null, errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }
    static success(message, data = null) {
        return new ApiResponse(true, message, data);
    }
    static error(message, errors) {
        return new ApiResponse(false, message, null, errors);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map