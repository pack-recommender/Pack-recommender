/// <reference types="astro/client" />

type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}) => Promise<Response>;
