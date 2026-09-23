import { NextResponse } from "next/server";
import * as accountService from "@/services/accountService";
import * as fraudService from "@/services/fraudService";
import * as userService from "@/services/userService";
import { requireApiUser } from "@/lib/auth/apiGuard";
import { validateTransferInput } from "@/lib/validation/rules";

/**
 * Dry-run risk preview for the transfer form's "Review Transfer" step.
 * Does NOT persist a transaction or create an alert - see POST /api/transactions
 * for the call that actually commits the transfer.
 */
export async function POST(request) {
  const { user, error } = await requireApiUser(["CUSTOMER"]);
  if (error) return error;

  try {
    const body = await request.json();
    const fieldErrors = validateTransferInput(body);
    if (Object.keys(fieldErrors).length) {
      return NextResponse.json({ error: "Enter valid transfer details.", fieldErrors }, { status: 400 });
    }

    const account = accountService.getForUser(user.id, body.accountId);
    if (!account) {
      return NextResponse.json({ error: "Select a valid account to send from." }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (amount > account.availableBalance) {
      return NextResponse.json(
        { error: "Insufficient balance for this transfer.", fieldErrors: { amount: "Amount exceeds your available balance." } },
        { status: 400 }
      );
    }

    // fraudService needs homeCity for the location check, which the lean
    // session user does not carry - load the full record.
    const fullUser = userService.getById(user.id);
    const analysis = fraudService.analyzeTransfer({
      account,
      user: fullUser,
      amount,
      timestamp: new Date().toISOString(),
      deviceFingerprint: body.deviceFingerprint,
      location: body.location,
    });

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[POST /api/fraud/analyze]", err.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
