import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email, resetUrl }: PasswordResetRequest = await req.json();

    // Validate required fields
    if (!email || !resetUrl) {
      throw new Error("Missing required fields: email and resetUrl");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    console.log(`Sending password reset email to: ${email}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Korepetycje z Chemii <onboarding@resend.dev>",
        to: [email],
        subject: "Reset hasła - Korepetycje z Chemii",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset hasła</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2a9d8f 0%, #1d7a6f 100%); border-radius: 16px 16px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                          🧪 Korepetycje z Chemii
                        </h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                          z Anetą
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                          Resetowanie hasła
                        </h2>
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                          Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Kliknij poniższy przycisk, aby ustawić nowe hasło:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2a9d8f 0%, #1d7a6f 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);">
                            🔐 Ustaw nowe hasło
                          </a>
                        </div>
                        
                        <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                          Ten link wygaśnie za <strong>1 godzinę</strong>.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                        
                        <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                          Jeśli nie prosiłeś/aś o reset hasła, zignoruj tę wiadomość. Twoje konto jest bezpieczne.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; text-align: center;">
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          © 2026 Korepetycje z Chemii. Wszelkie prawa zastrzeżone.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await res.json();
    console.log("Password reset email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in send-password-reset function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
