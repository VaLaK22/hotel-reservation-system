import { TypeCompiler } from '@sinclair/typebox/compiler';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

// General-purpose validation middleware
export const validate = (schema: any) => {
  const validator = TypeCompiler.Compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    const isValid = validator.Check(req.body);
    if (!isValid) {
      // res.status(400).json({ errors:  });
      const message = JSON.stringify([...validator.Errors(req.body)].map(({ path, message }) => ({ path, message }))).replace(/"/g, '');

      console.log('message', message);
      next(new HttpException(400, message));
    } else {
      next();
    }
  };
};
