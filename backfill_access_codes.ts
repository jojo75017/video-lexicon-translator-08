import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data: subscribers, error } = await supabase
  .from("subscribers")
  .select("id, email")
  .is("access_code", null);

if (error) {
  console.error("Error fetching subscribers:", error);
  Deno.exit(1);
}

console.log(`Found ${subscribers.length} subscribers with null access_code`);

for (const sub of subscribers) {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const accessCode = `EBK-${randomPart}`;
  
  const { error: updateError } = await supabase
    .from("subscribers")
    .update({ access_code: accessCode })
    .eq("id", sub.id);
    
  if (updateError) {
    console.error(`Failed to update ${sub.email}:`, updateError);
  } else {
    console.log(`Updated ${sub.email} with code ${accessCode}`);
  }
}
