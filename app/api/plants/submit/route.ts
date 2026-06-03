import { NextResponse } from "next/server";

const DATABASE_ID = "15b7dac2-df5f-48f3-bbdd-1f01d1ec5a81";

// Safe Swap Credit Framework Valuation
function calculateCreditValue(plantName: string, variety: string): number {
  const name = `${plantName} ${variety}`.toLowerCase();

  // Collector Tier (4+ Credits)
  if (
    name.includes("spiritus sancti") ||
    name.includes("variegated monstera albo") ||
    name.includes("albo") && name.includes("monstera") ||
    name.includes("silver dragon") && name.includes("variegated")
  ) {
    return 4;
  }

  // Premium Growth (2-3 Credits)
  if (
    name.includes("esqueleto") ||
    name.includes("clarinervium") ||
    name.includes("obliqua") ||
    name.includes("frydek") ||
    name.includes("anthurium") ||
    name.includes("alocasia")
  ) {
    return 2;
  }

  // Common Sprout (1 Credit)
  return 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plant_name, variety, neighborhood, owner_email, image_url, cutting_size } = body;

    // Standard Validation
    if (!plant_name || !neighborhood || !owner_email) {
      return NextResponse.json(
        { error: "Missing required fields (plant_name, neighborhood, owner_email)" },
        { status: 400 }
      );
    }

    // Determine credit valuation
    const credit_value = calculateCreditValue(plant_name, variety || "");

    // Prepare row payload matching target database schema
    const rowData = {
      plant_name,
      variety: variety || "Standard",
      neighborhood,
      status: "available",
      owner_email,
      image_url: image_url || "",
      cutting_size: cutting_size || "Rooted Cutting",
      credit_value,
      health_status: "pending" // Auto-starts as pending AI Health Passport check
    };

    // Push to Baget publicWrites endpoint
    const response = await fetch(`https://app.baget.ai/api/public/databases/${DATABASE_ID}/rows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: rowData })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Database insertion failed: ${errorText}` },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Plant submission cataloged successfully",
      data: {
        ...rowData,
        database_id: result.id
      }
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
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

// Support CORS preflight options
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
