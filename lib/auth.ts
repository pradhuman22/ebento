import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { render } from "@react-email/components";
import EmailVerificationTemplate from "@/app/(auth)/templates/email-verification";
import { sendEmail } from "./email";
import ResetPasswordTemplate from "@/app/(auth)/templates/reset-password";
import { stripe as betterAuthStripe } from "@better-auth/stripe";
import { stripe } from "./stripe";

const stripeClient = stripe;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      contact: {
        type: "string",
        required: false,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const emailHtml = await render(
        ResetPasswordTemplate({
          username: user.name,
          resetPasswordUrl: url,
        })
      );
      await sendEmail({
        to: user.email,
        subject: "Reset your ebento password",
        html: emailHtml,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      const emailHtml = await render(
        EmailVerificationTemplate({
          username: user.name,
          verifyUrl: url,
        })
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: emailHtml,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ["http://localhost:3001", "192.168.11.8"],
  plugins: [
    nextCookies(),
    betterAuthStripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "pro",
            priceId: "price_1T2XQvCpJphJ9HL3bbRAAvPr",
          },
        ],
      },
    }),
  ],
  account: {
    accountLinking: {
      enabled: false,
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
