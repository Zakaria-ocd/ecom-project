import { NextResponse } from 'next/server';
import dbConnect from '@/db'; 
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
    await dbConnect();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: 'Invalid email' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successfully' });
}