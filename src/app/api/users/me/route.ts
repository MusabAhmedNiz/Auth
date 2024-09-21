import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { tokenData } from "@/helper/tokenData";

connect();

export async function POST(request: NextRequest) {
  const userId = await tokenData(request);
  const user = await User.findById({ _id: userId }).select("-password");
  return NextResponse.json({
    message: "User found",
    data: user
  });
}
