import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { slug, passcode } = await request.json();

        // Verify against DB
        // const { data } = await supabase.from('valentine_links').select('passcode_hash').eq('slug', slug).single();
        // const valid = await bcrypt.compare(passcode, data.passcode_hash);

        // Mock verification
        if (passcode.length >= 4) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Incorrect passcode' }, { status: 401 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
