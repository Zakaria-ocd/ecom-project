import { NextResponse } from 'next/server';
import dbConnect from '@/db';
import DashboardData from '@/models/dahboardData';

export async function GET() {
  await dbConnect();

  const dashboardData = await DashboardData.findOne();
  if (!dashboardData) {
    return NextResponse.json({ message: 'No data found' }, { status: 404 });
  }

  return NextResponse.json(dashboardData);
}
