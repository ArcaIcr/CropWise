import { pushChanges, pullUpdates } from '../services/syncService';
import { supabase } from '../config/supabase';

// placeholder to ensure imports are used
console.log('Supabase URL:', supabase);
console.log('Sync functions loaded:', pushChanges, pullUpdates);
