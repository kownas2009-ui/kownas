import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    
    // 7 days ago for completed bookings (confirmed/pending) - after lesson is done
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    // 10 days ago for cancelled bookings
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const tenDaysAgoStr = tenDaysAgo.toISOString().split('T')[0];

    console.log(`Current date: ${now.toISOString()}`);
    console.log(`Cleaning up completed/pending bookings with date older than ${sevenDaysAgoStr}`);
    console.log(`Cleaning up cancelled bookings with date older than ${tenDaysAgoStr}`);

    // Delete old confirmed/pending bookings (lessons that happened more than 7 days ago)
    const { data: deletedCompleted, error: completedError } = await supabase
      .from("bookings")
      .delete()
      .lt("booking_date", sevenDaysAgoStr)
      .in("status", ["confirmed", "pending"])
      .select();

    if (completedError) {
      console.error("Error deleting completed bookings:", completedError);
      throw completedError;
    }

    // Delete cancelled bookings older than 10 days
    const { data: deletedCancelled, error: cancelledError } = await supabase
      .from("bookings")
      .delete()
      .lt("booking_date", tenDaysAgoStr)
      .eq("status", "cancelled")
      .select();

    if (cancelledError) {
      console.error("Error deleting cancelled bookings:", cancelledError);
      throw cancelledError;
    }

    const totalDeleted = (deletedCompleted?.length || 0) + (deletedCancelled?.length || 0);

    console.log(`Cleanup complete!`);
    console.log(`Deleted ${deletedCompleted?.length || 0} completed/pending bookings (older than 7 days)`);
    console.log(`Deleted ${deletedCancelled?.length || 0} cancelled bookings (older than 10 days)`);
    console.log(`Total deleted: ${totalDeleted}`);

    if (deletedCompleted && deletedCompleted.length > 0) {
      console.log("Deleted completed bookings:", deletedCompleted.map(b => ({
        id: b.id,
        date: b.booking_date,
        status: b.status
      })));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleanup complete - deleted ${totalDeleted} old bookings`,
        deleted: {
          completed: deletedCompleted?.length || 0,
          cancelled: deletedCancelled?.length || 0,
          total: totalDeleted
        },
        thresholds: {
          completedBeforeDate: sevenDaysAgoStr,
          cancelledBeforeDate: tenDaysAgoStr
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in cleanup-old-bookings function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

