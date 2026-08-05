/**
 * ClinOS Multi-Role Demo User Seeding Script
 * 
 * Programmatically creates and seeds 3 distinct demo accounts with 'Hackathon2026!'
 * into Supabase Auth and the public.profiles table using the Supabase Service Role Key.
 * 
 * Usage:
 *   node server/scripts/seed-demo-users.js
 *   OR npm run seed:users
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server .env and root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

console.log('\n======================================================');
console.log('🏥 ClinOS Multi-Role Demo User Provisioning Engine');
console.log('======================================================\n');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.includes('demo_') || SUPABASE_SERVICE_ROLE_KEY.includes('demo-')) {
  console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is not set or using placeholder credentials.');
  console.warn('ℹ️ To seed directly into Supabase Cloud:');
  console.warn('   1. Obtain your Service Role Key from: Supabase Dashboard -> Project Settings -> API');
  console.warn('   2. Add SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> to your .env file.');
  console.warn('   3. Rerun: npm run seed:users\n');
  console.log('ℹ️ In local offline mode, ClinOS automatically falls back to instant local authentication for all 3 demo accounts.\n');
}

const DEMO_USERS = [
  {
    email: 'lokesh@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Lokesh Yadhav',
    role: 'patient',
    roleLabel: 'Patient / Care Recipient'
  },
  {
    email: 'dr.sharma@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Dr. Sharma (Lead Physician)',
    role: 'physician',
    roleLabel: 'Lead Attending Physician'
  },
  {
    email: 'intake@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Nurse Priya (Intake Specialist)',
    role: 'nurse',
    roleLabel: 'Triage Nurse & Clinical Intake'
  }
];

async function seedDemoUsers() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.includes('demo_') || SUPABASE_SERVICE_ROLE_KEY.includes('demo-')) {
    console.log('📋 Demo Accounts Ready for One-Click Hackathon Login:');
    DEMO_USERS.forEach((u, idx) => {
      console.log(`  ${idx + 1}. [${u.role.toUpperCase()}] ${u.full_name}`);
      console.log(`     Email:    ${u.email}`);
      console.log(`     Password: ${u.password}\n`);
    });
    return;
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log(`📡 Connecting to Supabase Instance: ${SUPABASE_URL}\n`);

  for (const userConfig of DEMO_USERS) {
    console.log(`🔄 Provisioning [${userConfig.role.toUpperCase()}] ${userConfig.full_name} (${userConfig.email})...`);

    try {
      // 1. Check if user already exists
      let userId = null;
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

      if (!listError && existingUsers?.users) {
        const found = existingUsers.users.find(u => u.email?.toLowerCase() === userConfig.email.toLowerCase());
        if (found) {
          userId = found.id;
          console.log(`   ℹ️ Auth user already exists with ID: ${userId}. Updating password...`);
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: userConfig.password,
            user_metadata: {
              full_name: userConfig.full_name,
              role: userConfig.role
            },
            email_confirm: true
          });
        }
      }

      // 2. If not found, create new auth user
      if (!userId) {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userConfig.email,
          password: userConfig.password,
          email_confirm: true,
          user_metadata: {
            full_name: userConfig.full_name,
            role: userConfig.role
          }
        });

        if (createError) {
          console.error(`   ❌ Failed to create auth user for ${userConfig.email}:`, createError.message);
          continue;
        }

        userId = newUser.user.id;
        console.log(`   ✅ Auth user created with ID: ${userId}`);
      }

      // 3. Upsert into public.profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: userConfig.email,
          full_name: userConfig.full_name,
          role: userConfig.role,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (profileError) {
        console.warn(`   ⚠️ Note on public.profiles upsert: ${profileError.message}`);
      } else {
        console.log(`   ✅ Profile linked in public.profiles table [Role: ${userConfig.role}]`);
      }

      console.log(`   🎉 Successfully configured ${userConfig.email}\n`);

    } catch (err) {
      console.error(`   ❌ Error provisioning ${userConfig.email}:`, err.message || err);
    }
  }

  console.log('======================================================');
  console.log('✅ Demo Account Seeding Complete!');
  console.log('======================================================\n');
}

seedDemoUsers().catch(err => {
  console.error('Fatal seed script error:', err);
  process.exit(1);
});
