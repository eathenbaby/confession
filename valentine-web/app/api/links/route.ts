import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// import bcrypt from 'bcrypt'; // Would need to install bcrypt or use a lightweight alternative like 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { displayName, slug, passcode } = body;

        // Validate input...

        // TODO: Hash passcode
        // const hashedPassword = await bcrypt.hash(passcode, 10);

        // Insert into Supabase
        /*
        const { data, error } = await supabase
          .from('valentine_links')
          .insert([
            { display_name: displayName, slug, passcode_hash: passcode } // storing raw for MVP if unauthorized
          ])
          .select();
        
        if (error) throw error;
        */

        // Mock success
        return NextResponse.json({ success: true, slug });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
    }
}
