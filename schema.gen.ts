/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/pets": {
    /** List all pets */
    get: operations["listPets"];
    /** Create a pet */
    post: operations["createPets"];
  };
  "/pets/{petId}": {
    /** Info for a specific pet */
    get: operations["showPetById"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    Pet: {
      /** Format: int64 */
      id: number;
      name: string;
      /** @enum {string} */
      category?: "dog" | "cat";
    };
    Pets: (components["schemas"]["Pet"])[];
    Error: {
      /** Format: int32 */
      code: number;
      message: string;
    };
    /** PetValidationError */
    PetValidationError: {
      /** @enum {string} */
      field?: "name" | "category";
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {

  listPets: {
    /** List all pets */
    parameters?: {
        /** @description How many items to return at one time (max 100) */
      query?: {
        limit?: number;
      };
    };
    responses: {
      /** @description A paged array of pets */
      200: {
        headers: {
          /** @description A link to the next page of responses */
          "x-next"?: string;
        };
        content: {
          "application/json": components["schemas"]["Pets"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": {
            message?: string;
            validationError?: components["schemas"]["PetValidationError"];
          };
        };
      };
      /** @description unexpected error */
      default: {
        content: {
          "application/json": components["schemas"]["Error"];
        };
      };
    };
  };
  createPets: {
    /** Create a pet */
    requestBody?: {
      content: {
        "application/json": {
          name?: string;
        };
      };
    };
    responses: {
      /** @description Null response */
      201: never;
      /** @description unexpected error */
      default: {
        content: {
          "application/json": components["schemas"]["Error"];
        };
      };
    };
  };
  showPetById: {
    /** Info for a specific pet */
    parameters: {
        /** @description The id of the pet to retrieve */
      path: {
        petId: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["Pet"];
        };
      };
      /** @description Expected response to a valid request */
      400: {
        content: {
          "application/json": components["schemas"]["Pet"];
        };
      };
      /** @description unexpected error */
      default: {
        content: {
          "application/json": components["schemas"]["Error"];
        };
      };
    };
  };
}
