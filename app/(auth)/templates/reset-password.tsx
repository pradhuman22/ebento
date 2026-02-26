import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordTemplateProps {
  username: string;
  resetPasswordUrl: string;
}

export const ResetPasswordTemplate = ({
  username = "there",
  resetPasswordUrl = "https://example.com/reset-password?token=xyz",
}: ResetPasswordTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your ebento password</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-slate-50 px-2 font-sans">
          <Container className="mx-auto my-10 max-w-[465px] rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
            <Heading className="mx-0 mb-6 p-0 text-left text-2xl font-bold text-slate-900">
              Reset your password
            </Heading>

            <Text className="text-base leading-6 text-slate-700">
              Hi {username},
            </Text>

            <Text className="text-base leading-6 text-slate-700">
              Someone recently requested a password reset for your ebento
              account. If this was you, you can set a new password by clicking
              the button below:
            </Text>

            <Section className="mt-8 mb-8">
              <Button
                className="rounded-md bg-black px-6 py-3 text-center text-sm font-semibold text-white no-underline"
                href={resetPasswordUrl}
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-sm leading-6 text-slate-500">
              <strong>Note:</strong> This link will expire in 60 minutes for
              security reasons. If you did not request a password reset, please
              ignore this email or reply to let us know. Your password will not
              change until you access the link above and create a new one.
            </Text>

            <Hr className="my-8 border-slate-200" />

            <Section>
              <Text className="text-xs leading-5 text-slate-400">
                If you're having trouble with the button above, copy and paste
                the URL below into your web browser:
              </Text>
              <Link
                href={resetPasswordUrl}
                className="text-xs break-all text-blue-600 underline"
              >
                {resetPasswordUrl}
              </Link>
            </Section>

            <Text className="mt-8 text-xs text-slate-400">
              &copy; 2026 ebento, Inc. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordTemplate;
