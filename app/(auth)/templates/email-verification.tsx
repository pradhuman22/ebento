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

interface EmailVerificationTemplateProps {
  verifyUrl: string;
  username: string;
}

const EmailVerificationTemplate = ({
  username = "User",
  verifyUrl = "https://example.com/verify?token=123",
}: EmailVerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address to get started.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-slate-50 px-2 font-sans">
          <Container className="mx-auto my-10 max-w-[465px] rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-bold text-slate-800">
              Verify your email
            </Heading>
            <Text className="text-base leading-6 text-slate-600">
              Hello {username},
            </Text>
            <Text className="text-base leading-6 text-slate-600">
              Welcome to our platform! Please click the button below to verify
              your account and complete your registration.
            </Text>

            <Section className="mt-8 mb-8 text-center">
              <Button
                className="rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white no-underline"
                href={verifyUrl}
              >
                Verify Account
              </Button>
            </Section>

            <Text className="text-sm text-slate-500 italic">
              This link will expire in 24 hours. If you did not sign up for this
              account, you can ignore this email.
            </Text>

            <Hr className="my-6 border-slate-200" />

            <Text className="text-xs leading-4 text-slate-400">
              If the button doesn't work, copy and paste this URL: <br />
              <Link href={verifyUrl} className="text-indigo-600 underline">
                {verifyUrl}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerificationTemplate;
