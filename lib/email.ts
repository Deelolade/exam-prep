import { resend } from "./resend";
import { EMAIL_FROM } from "../utils/env";

type EmailProps = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: EmailProps) => {
  const { data, error } = await resend().emails.send({
    to,
    from: EMAIL_FROM,
    subject,
    html,
  });
  if (error) throw error;
  return data;
};
