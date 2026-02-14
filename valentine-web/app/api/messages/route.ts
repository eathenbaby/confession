import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, content, vibe, bouquetId, slug } = body;

        // Rate limiting check would go here...

        // Insert into Supabase
        /*
        const { error } = await supabase
          .from('messages')
          .insert([{ type, body: content, vibe, bouquet_id: bouquetId, link_slug: slug }]);
    
        if (error) throw error;
        */

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
