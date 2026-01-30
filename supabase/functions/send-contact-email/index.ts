import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactFormData = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Wymagane pola: imię, email, wiadomość" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email to Aneta using Resend's default domain
    const emailResponse = await resend.emails.send({
      from: "Formularz Kontaktowy <onboarding@resend.dev>",
      to: ["aneta.kownacka79@gmail.com"],
      reply_to: email,
      subject: `Nowa wiadomość od ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="padding: 40px; background: linear-gradient(135deg, #0f766e 0%, #134e4a 100%); text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">📬 Nowa wiadomość z formularza kontaktowego</h1>
          </div>
          <div style="padding: 32px;">
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #0f766e; font-size: 16px;">Dane kontaktowe:</h3>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Imię:</strong> ${name}
              </p>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Email:</strong> <a href="mailto:${email}" style="color: #0f766e;">${email}</a>
              </p>
              ${phone ? `
              <p style="margin: 8px 0; color: #374151;">
                <strong>Telefon:</strong> <a href="tel:${phone}" style="color: #0f766e;">${phone}</a>
              </p>
              ` : ''}
            </div>
            
            <div style="background: #f0fdfa; border-radius: 12px; padding: 24px; border-left: 4px solid #0f766e;">
              <h3 style="margin: 0 0 16px 0; color: #0f766e; font-size: 16px;">Wiadomość:</h3>
              <p style="margin: 0; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Możesz odpowiedzieć bezpośrednio na ten email lub kliknąć "Odpowiedz".
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Check for Resend errors
    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      throw new Error(emailResponse.error.message);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Email wysłany pomyślnie" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
