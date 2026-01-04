import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from "@react-native-async-storage/async-storage";

// هذه القيم تحصل عليها من إعدادات مشروعك في Supabase
const SUPABASE_URL = 'https://znpvmbsnrpdwortyoukn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucHZtYnNucnBkd29ydHlvdWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI2MzY2NCwiZXhwIjoyMDgxODM5NjY0fQ.XiUT4UtUo1l30lGqPsDzQHjIKw1QCeQRqSlzYG0xxC4';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
