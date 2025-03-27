import * as Joi from "joi";

/**
 * Esquema de validación de variables de entorno utilizando Joi.
 * Se usa para asegurar que las variables de entorno requeridas estén definidas y tengan los valores correctos.
 */
export const JoiValidationSchema = Joi.object({
    /**
     * Validación de la variable de entorno MONGODB.
     * Es obligatoria, ya que se necesita para la conexión con la base de datos.
     */
    MONGODB: Joi.required(),

    /**
     * Validación de la variable de entorno PORT.
     * Debe ser un número y tiene un valor por defecto de 3005 si no se proporciona.
     */
    PORT: Joi.number().default(3005),

    /**
     * Validación de la variable de entorno DEFAULT_LIMIT.
     * Debe ser un número y tiene un valor por defecto de 6 si no se proporciona.
     */
    DEFAULT_LIMIT: Joi.number().default(6),
});