import { Resend } from "resend";
import { RESEND_API_KEY } from "../utils/env";

export const resend = new Resend(RESEND_API_KEY);
