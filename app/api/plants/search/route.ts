import { NextResponse } from "next/server";

const DATABASE_ID = "15b7dac2-df5f-48f3-bbdd-1f01d1ec5a81";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const neighborhood = searchParams.get("neighborhood");
    const query = searchParams.get("query");
    const minCredits = searchParams.get("minCredits");

    // Fetch from public reads API for plant listings
    const response = await fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/rows`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      next: { revalidate: 0 } // Bypass fetch cache for real-time inventories
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch plant listings from the ledger" },
        { status: 500 }
      );
    }

    const body = await response.json();
    let listings = body.rows || [];

    // Filter by neighborhood if requested
    if (neighborhood) {
      const targetNeighborhood = neighborhood.toLowerCase();
      listings = listings.filter((item: any) => 
        item.data.neighborhood && item.data.neighborhood.toLowerCase().includes(targetNeighborhood)
      );
    }

    // Filter by general search query (plant name or variety)
    if (query) {
      const searchTerms = query.toLowerCase();
      listings = listings.filter((item: any) => {
        const name = (item.data.plant_name || "").toLowerCase();
        const variety = (item.data.variety || "").toLowerCase();
        return name.includes(searchTerms) || variety.includes(searchTerms);
      });
    }

    // Filter by credit values
    if (minCredits) {
      const minVal = parseInt(minCredits, 10);
      if (!isNaN(minVal)) {
        listings = listings.filter((item: any) => {
          const val = Number(item.data.credit_value);
          return !isNaN(val) && val >= minVal;
        });
      }
    }

    // Unify data return block
    const formattedListings = listings.map((item: any) => ({
      id: item.id,
      plant_name: item.data.plant_name,
      variety: item.data.variety || "Standard",
      neighborhood: item.data.neighborhood,
      status: item.data.status || "available",
      owner_email: item.data.owner_email,
      image_url: item.data.image_url || null,
      cutting_size: item.data.cutting_size || "Rooted Cutting",
      credit_value: Number(item.data.credit_value) || 1,
      health_status: item.data.health_status || "pending",
      created_at: item.createdAt
    }));

    return NextResponse.json({
      success: true,
      count: formattedListings.length,
      listings: formattedListings
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
