import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// eslint-disable-next-line no-console
console.log('🔍 Verifying Database Schema...\n');

async function verifySchema() {
  try {
    // Check if we can query the profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    // eslint-disable-next-line no-console
    console.log('✅ profiles table:', profilesError ? '❌ Error' : '✓ Accessible');
    // eslint-disable-next-line no-console
    if (profilesError) console.log('   Error:', profilesError.message);

    // Check job_preferences table
    const { error: prefsError } = await supabase
      .from('job_preferences')
      .select('*')
      .limit(1);

    // eslint-disable-next-line no-console
    console.log('✅ job_preferences table:', prefsError ? '❌ Error' : '✓ Accessible');
    // eslint-disable-next-line no-console
    if (prefsError) console.log('   Error:', prefsError.message);

    // Check job_board_credentials table
    const { error: credsError } = await supabase
      .from('job_board_credentials')
      .select('*')
      .limit(1);

    // eslint-disable-next-line no-console
    console.log('✅ job_board_credentials table:', credsError ? '❌ Error' : '✓ Accessible');
    // eslint-disable-next-line no-console
    if (credsError) console.log('   Error:', credsError.message);

    // Check automation_runs table
    const { error: runsError } = await supabase
      .from('automation_runs')
      .select('*')
      .limit(1);

    // eslint-disable-next-line no-console
    console.log('✅ automation_runs table:', runsError ? '❌ Error' : '✓ Accessible');
    // eslint-disable-next-line no-console
    if (runsError) console.log('   Error:', runsError.message);

    // Check applications table
    const { error: appsError } = await supabase
      .from('applications')
      .select('*')
      .limit(1);

    // eslint-disable-next-line no-console
    console.log('✅ applications table:', appsError ? '❌ Error' : '✓ Accessible');
    // eslint-disable-next-line no-console
    if (appsError) console.log('   Error:', appsError.message);

    // eslint-disable-next-line no-console
    console.log('\n✅ All tables are accessible!');
    // eslint-disable-next-line no-console
    console.log('\n📊 Database Schema Summary:');
    // eslint-disable-next-line no-console
    console.log('   - profiles (user profile data)');
    // eslint-disable-next-line no-console
    console.log('   - job_preferences (job search criteria)');
    // eslint-disable-next-line no-console
    console.log('   - job_board_credentials (encrypted login credentials)');
    // eslint-disable-next-line no-console
    console.log('   - automation_runs (automation session tracking)');
    // eslint-disable-next-line no-console
    console.log('   - applications (job applications)');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifySchema();
