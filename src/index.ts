import {IsOptional, IsString, Matches, validate} from "class-validator";
import {Request, RequestHandler} from "express";
import {plainToClass} from "class-transformer";
import {CreateBlindpoolRequest} from "./second";

console.log("Hello!");

class RequestBody {
    @IsString()
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

console.log(RequestBody);

const invalidBody = {
    // Let's create an object with a name attribute that is a number instead of a string, to test if validation will catch this.
    name: 5
};

const validBody = {
    name: "Hello"
};


const invalidRequest: Partial<Request> = { body: invalidBody};
const validRequest: Partial<Request> = { body: validBody};

const body = plainToClass(CreateBlindpoolRequest, invalidRequest.body as Object);

// Direct validation, which works.
validate(body).then((validationErrors) => {
    console.log(validationErrors.length);
    validationErrors.forEach((validationError) => {
        console.log("Direct validation error", validationError);
    });
});

export async function validationMiddleware<T extends Object>(type: any): Promise<T> {
    console.log(type);
    const genericBody: T = plainToClass(type, invalidRequest.body as Object);
    console.log("Generic body:", genericBody);
    let validationErrors = await validate(genericBody);

    if (validationErrors.length > 0) {
        console.log(validationErrors.length);
        validationErrors.forEach((validationError) => {
            console.log("Generic validation error", validationError);
        });
    }

    return genericBody;
}

validationMiddleware<CreateBlindpoolRequest>(CreateBlindpoolRequest).then(() => {
    console.log("Done");
});
