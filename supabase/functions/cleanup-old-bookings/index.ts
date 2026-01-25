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
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    console.log(`Cleaning up bookings older than ${sevenDaysAgoStr}`);

    // Delete old confirmed/pending bookings (completed lessons older than 7 days)
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

    // For cancelled bookings: delete those older than 7 days
    // We keep late-cancelled ones for 7 days so admin can track unpaid fees
    const { data: deletedCancelled, error: cancelledError } = await supabase
      .from("bookings")
      .delete()
      .lt("booking_date", sevenDaysAgoStr)
      .eq("status", "cancelled")
      .select();

    if (cancelledError) {
      console.error("Error deleting cancelled bookings:", cancelledError);
      throw cancelledError;
    }

    const totalDeleted = (deletedCompleted?.length || 0) + (deletedCancelled?.length || 0);

    console.log(`Deleted ${totalDeleted} old bookings (${deletedCompleted?.length || 0} completed, ${deletedCancelled?.length || 0} cancelled)`);

    return new Response(
      JSON.stringify({
        message: `Cleanup complete`,
        deleted: {
          completed: deletedCompleted?.length || 0,
          cancelled: deletedCancelled?.length || 0,
          total: totalDeleted
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

