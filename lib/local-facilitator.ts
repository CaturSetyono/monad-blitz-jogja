import type { FacilitatorClient } from "@x402/core/server";
import type { PaymentPayload, PaymentRequirements, VerifyResponse, SettleResponse, SupportedResponse } from "@x402/core/types";

export class LocalFacilitator implements FacilitatorClient {
  private network: `${string}:${string}`;

  constructor(network: `${string}:${string}` = "eip155:10143") {
    this.network = network;
  }

  async verify(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirements
  ): Promise<VerifyResponse> {
    return {
      isValid: true,
      payer: (paymentPayload.payload as any)?.authorization?.from ?? "0x0000000000000000000000000000000000000000",
    };
  }

  async settle(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirements
  ): Promise<SettleResponse> {
    return {
      success: true,
      payer: (paymentPayload.payload as any)?.authorization?.from ?? "0x0000000000000000000000000000000000000000",
      transaction: `0x${Date.now().toString(16).padStart(64, "0")}` as `0x${string}`,
      network: this.network,
    };
  }

  async getSupported(): Promise<SupportedResponse> {
    return {
      kinds: [
        {
          x402Version: 2,
          scheme: "exact",
          network: this.network,
          extra: {
            assetTransferMethod: "eip3009",
          },
        },
      ],
      extensions: [],
      signers: {},
    };
  }
}
