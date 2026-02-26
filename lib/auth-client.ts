import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>({
      user: {
        bio: {
          type: "string",
          required: false,
        },
        contact: {
          type: "string",
          required: false,
        },
      },
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});
