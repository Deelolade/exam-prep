import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

const NAVY = "#0F172A";
const BLUE = "#2563EB";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";

export type WelcomeEmailProps = {
  /** Base URL for links (e.g. "https://examprep.run"). */
  appUrl?: string;
};

export default function WelcomeEmail({ appUrl = "http://localhost:3000" }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your ExamPrep.run account is ready — let&apos;s start practicing.</Preview>
      <Body style={{ backgroundColor: BG, fontFamily: "Inter, Helvetica, Arial, sans-serif", margin: "0", padding: "40px 16px" }}>
        <Container
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            padding: "40px 36px",
          }}
        >
          <Text style={{ fontSize: "18px", fontWeight: 700, color: NAVY, margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            ExamPrep<span style={{ color: BLUE }}>.run</span>
          </Text>

          <Heading style={{ fontSize: "24px", fontWeight: 700, color: NAVY, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            Welcome to ExamPrep.run
          </Heading>

          <Text style={{ fontSize: "15px", lineHeight: "1.6", color: MUTED, margin: "0 0 24px" }}>
            Your account is ready. Practice realistic CBT questions for the OOU ND Computer
            Engineering screening, track your performance, and understand every answer.
          </Text>

          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={`${appUrl}/`}
              style={{
                backgroundColor: BLUE,
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Start practicing
            </Button>
          </Section>

          <Hr style={{ borderColor: BORDER, margin: "28px 0" }} />

          <Text style={{ fontSize: "12.5px", lineHeight: "1.6", color: MUTED, margin: "0" }}>
            You received this email because you created an account on ExamPrep.run. If this
            wasn&apos;t you, you can safely ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
