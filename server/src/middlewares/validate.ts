import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
};
