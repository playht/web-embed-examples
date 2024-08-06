import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('FAL KEY IS: ')
  console.log(process.env.FAL_KEY)
  return NextResponse.json({ message: 'This is a test route' }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Received POST request', data: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
