var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// lib/contact.ts
function getReturnPath(locale, status) {
  const base = locale === "he" ? "/he" : "/";
  const param = status === "sent" ? "sent=1" : "error=1";
  return `${base}?${param}#contact`;
}
__name(getReturnPath, "getReturnPath");
function wantsJson(request) {
  const accept = request.headers.get("Accept") || "";
  return accept.includes("application/json");
}
__name(wantsJson, "wantsJson");
function redirect(path) {
  return new Response(null, {
    status: 303,
    headers: { Location: path }
  });
}
__name(redirect, "redirect");
function jsonResponse(success, error) {
  return new Response(JSON.stringify(success ? { success: true } : { success: false, error }), {
    status: success ? 200 : 422,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
function respond(success, locale, request, error) {
  return wantsJson(request) ? jsonResponse(success, error) : redirect(getReturnPath(locale, success ? "sent" : "error"));
}
__name(respond, "respond");
async function handleContactPost(request, env) {
  let locale = "en";
  try {
    const formData = await request.formData();
    locale = String(formData.get("locale") || "en");
    const name = String(formData.get("name") || "").trim().slice(0, 200);
    const company = String(formData.get("company") || "").trim().slice(0, 200);
    const email = String(formData.get("email") || "").trim().slice(0, 254);
    const message = String(formData.get("message") || "").trim().slice(0, 5e3);
    if (!name || !company || !email || !message) {
      return respond(false, locale, request, "invalid_input");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(false, locale, request, "invalid_input");
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
      console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
      return respond(false, locale, request, "missing_config");
    }
    const from = env.CONTACT_FROM_EMAIL || "PackRecommender <onboarding@resend.dev>";
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Contact form: ${name} from ${company}`,
        text: `Name: ${name}
Company: ${company}
Email: ${email}

${message}`
      })
    });
    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, resendError);
      return respond(false, locale, request, "resend_failed");
    }
    return respond(true, locale, request);
  } catch (error) {
    console.error("Contact form error:", error);
    return respond(false, locale, request, "resend_failed");
  }
}
__name(handleContactPost, "handleContactPost");

// lib/maintenance.ts
var BYPASS_STORAGE_KEY = "testValue";
var BYPASS_QUERY_PARAM = "test";
function getTodayBypassCode(date = /* @__PURE__ */ new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}
__name(getTodayBypassCode, "getTodayBypassCode");
function isValidBypass(testValue, date = /* @__PURE__ */ new Date()) {
  return Boolean(testValue && testValue === getTodayBypassCode(date));
}
__name(isValidBypass, "isValidBypass");
function getMaintenancePath(pathname) {
  return pathname.startsWith("/he") ? "/he/maintenance" : "/maintenance";
}
__name(getMaintenancePath, "getMaintenancePath");
function isMaintenancePath(pathname) {
  return pathname === "/maintenance" || pathname === "/he/maintenance";
}
__name(isMaintenancePath, "isMaintenancePath");
function isMaintenanceAssetPath(pathname) {
  return pathname.startsWith("/_astro") || pathname.startsWith("/fonts/") || pathname.startsWith("/img/") || pathname.startsWith("/api/") || /\.(ico|gif|png|jpg|jpeg|webp|woff2|css|js|xml|txt|svg)$/i.test(pathname);
}
__name(isMaintenanceAssetPath, "isMaintenanceAssetPath");
function parseCookies(header) {
  return Object.fromEntries(
    header.split(";").map((part) => part.trim().split("=")).filter(([key]) => key).map(([key, ...value]) => [key, value.join("=")])
  );
}
__name(parseCookies, "parseCookies");

// worker/index.ts
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname === "/api/contact" && request.method === "POST") {
      return handleContactPost(request, env);
    }
    if (!isMaintenancePath(pathname) && !isMaintenanceAssetPath(pathname)) {
      const maintenanceEnabled = env.MAINTENANCE_MODE !== "false";
      if (maintenanceEnabled) {
        const cookies = parseCookies(request.headers.get("Cookie") || "");
        const queryTest = url.searchParams.get(BYPASS_QUERY_PARAM);
        const cookieTest = cookies[BYPASS_STORAGE_KEY];
        const testValue = queryTest || cookieTest || "";
        if (!isValidBypass(testValue)) {
          return Response.redirect(new URL(getMaintenancePath(pathname), url.origin), 302);
        }
        if (queryTest && isValidBypass(queryTest)) {
          const response = await env.ASSETS.fetch(request);
          const nextResponse = new Response(response.body, response);
          nextResponse.headers.append(
            "Set-Cookie",
            `${BYPASS_STORAGE_KEY}=${queryTest}; Path=/; Max-Age=86400; SameSite=Lax`
          );
          return nextResponse;
        }
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-W6t7wJ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-W6t7wJ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
