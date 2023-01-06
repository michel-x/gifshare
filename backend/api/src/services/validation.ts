import Joi from "joi";


export const stringNumber = (message: string) => Joi.string().pattern(/^\d+$/).messages({ 'string.pattern.base': message });
