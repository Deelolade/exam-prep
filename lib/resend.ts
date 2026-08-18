import { Resend } from "resend";
import { getResendApiKey } from "../utils/env";

export const resend = new Resend(getResendApiKey());
