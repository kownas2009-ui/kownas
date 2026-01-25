import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingWithProfile {
  id: string;
  booking_date: string;
  booking_time: string;
  lesson_type: string;
  status: string;
  user_id: string;
  profiles: {
    full_name: string;
    user_id: string;
  } | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current date and calculate 24h from now
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    // Get current hour for time window (send reminders for lessons within 24-25h)
    const currentHour = now.getHours();
    const targetHourStart = String(currentHour).padStart(2, '0') + ":00";
    const targetHourEnd = String(currentHour + 1).padStart(2, '0') + ":00";

    console.log(`Looking for lessons on ${tomorrowDateStr} between ${targetHourStart} and ${targetHourEnd}`);

    // Find confirmed bookings for tomorrow at this hour
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        booking_time,
        lesson_type,
        status,
        user_id,
        profiles (
          full_name,
          user_id
        )
      `)
      .eq("booking_date", tomorrowDateStr)
      .eq("status", "confirmed")
      .gte("booking_time", targetHourStart)
      .lt("booking_time", targetHourEnd);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      throw bookingsError;
    }

    console.log(`Found ${bookings?.length || 0} bookings to remind`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ message: "No reminders to send", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailsSent: string[] = [];

    for (const booking of bookings) {
      const typedBooking = booking as unknown as BookingWithProfile;
      
      // Get user email from auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(typedBooking.user_id);

      if (userError || !userData?.user?.email) {
        console.error(`Could not get email for user ${typedBooking.user_id}:`, userError);
        continue;
      }

      const userEmail = userData.user.email;
      const studentName = typedBooking.profiles?.full_name || "Uczniu";

      try {
        const emailResponse = await resend.emails.send({
          from: "Korepetycje z Chemii <noreply@lovableproject.com>",
          to: [userEmail],
          subject: `Przypomnienie: Jutro lekcja chemii o ${typedBooking.booking_time}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f766e 0%, #134e4a 100%); border-radius: 16px; overflow: hidden;">
              <div style="padding: 40px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🧪 Przypomnienie o lekcji</h1>
              </div>
              <div style="background: #ffffff; padding: 40px;">
                <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
                  Cześć <strong>${studentName}</strong>! 👋
                </p>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                  Przypominamy o Twojej lekcji chemii, która odbędzie się <strong>jutro</strong>!
                </p>
                
                <div style="background: #f0fdfa; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0f766e;">
                  <p style="margin: 0 0 12px 0; color: #0f766e; font-weight: 600;">📅 Szczegóły lekcji:</p>
                  <p style="margin: 4px 0; color: #1f2937;">
                    <strong>Data:</strong> ${new Date(typedBooking.booking_date).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p style="margin: 4px 0; color: #1f2937;">
                    <strong>Godzina:</strong> ${typedBooking.booking_time}
                  </p>
                  <p style="margin: 4px 0; color: #1f2937;">
                    <strong>Typ:</strong> ${typedBooking.lesson_type}
                  </p>
                </div>
                
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                  Pamiętaj, aby przygotować się do zajęć i mieć pod ręką wszystkie materiały! 📚
                </p>
                
                <p style="font-size: 14px; color: #9ca3af; margin-top: 32px; text-align: center;">
                  Do zobaczenia na lekcji!<br/>
                  <strong>Aneta Kownacka</strong>
                </p>
              </div>
              <div style="background: #f3f4f6; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  Masz pytania? Napisz na: a.kownacka@gmail.com lub zadzwoń: 507 125 569
                </p>
              </div>
            </div>
          `,
        });

        console.log(`Email sent to ${userEmail}:`, emailResponse);
        emailsSent.push(userEmail);
      } catch (emailError) {
        console.error(`Failed to send email to ${userEmail}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Sent ${emailsSent.length} reminder emails`, 
        count: emailsSent.length,
        emails: emailsSent 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-lesson-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
