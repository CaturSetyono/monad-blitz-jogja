import type { HTTPAdapter, HTTPRequestContext } from "@x402/core/server";
import type { Request, Response, NextFunction } from "express";
import { x402HTTPResourceServer } from "@x402/core/server";

class ExpressAdapter implements HTTPAdapter {
  constructor(private req: Request) {}

  getHeader(name: string): string | undefined {
    return this.req.headers[name] as string | undefined;
  }

  getMethod(): string {
    return this.req.method;
  }

  getPath(): string {
    return this.req.path;
  }

  getUrl(): string {
    return `${this.req.protocol}://${this.req.get("host")}${this.req.originalUrl}`;
  }

  getAcceptHeader(): string {
    return this.req.headers.accept ?? "";
  }

  getUserAgent(): string {
    return this.req.headers["user-agent"] ?? "";
  }

  getQueryParams(): Record<string, string | string[]> {
    const params: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(this.req.query)) {
      if (typeof value === "string") {
        params[key] = value;
      } else if (Array.isArray(value)) {
        params[key] = value as string[];
      }
    }
    return params;
  }

  getBody(): unknown {
    return this.req.body;
  }
}

export async function x402ExpressMiddleware(
  httpServer: x402HTTPResourceServer,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adapter = new ExpressAdapter(req);
  const paymentHeader = req.headers["x-payment"] as string | undefined;

  const context: HTTPRequestContext = {
    adapter,
    path: req.path,
    method: req.method,
    paymentHeader,
  };

  const result = await httpServer.processHTTPRequest(context);

  if (result.type === "no-payment-required") {
    return next();
  }

  if (result.type === "payment-verified") {
    res.locals.paymentPayload = result.paymentPayload;
    res.locals.paymentRequirements = result.paymentRequirements;

    const originalSend = res.send.bind(res);
    res.send = function (body: any) {
      res.send = originalSend;
      return originalSend(body);
    };

    return next();
  }

  if (result.type === "payment-error") {
    const { status, headers, body } = result.response;
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
    return res.status(status).json(body);
  }
}
