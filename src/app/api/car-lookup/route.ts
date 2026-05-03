import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const make = (searchParams.get('make') ?? '').trim();
  const year = (searchParams.get('year') ?? new Date().getFullYear().toString()).trim();

  if (!make) return NextResponse.json({ models: [] });

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return NextResponse.json({ models: [] });
    const data = await res.json();
    const models: string[] = (data.Results ?? [])
      .map((r: { Model_Name: string }) => r.Model_Name)
      .filter(Boolean)
      .sort();
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ models: [] });
  }
}
