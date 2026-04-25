import { x402ResourceServer, x402HTTPResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { type MoneyParser, type Network, type AssetAmount } from "@x402/core/types";
import { MONAD_NETWORK } from "./monad";
import { LocalFacilitator } from "./local-facilitator";

const MONAD_USDC = "0x0000000000000000000000000000000000000000" as `0x${string}`;

const monadMoneyParser: MoneyParser = async (amount: number, network: Network) => {
  if (network !== MONAD_NETWORK) return null;
  return {
    asset: MONAD_USDC,
    amount: BigInt(Math.floor(amount * 1e6)).toString(),
  };
};

export async function createAgentServer(config: {
  payTo: `0x${string}`;
  price: string;
  description: string;
}) {
  const facilitator = new LocalFacilitator(MONAD_NETWORK);
  const resourceServer = new x402ResourceServer(facilitator);

  const evmServer = new ExactEvmScheme();
  evmServer.registerMoneyParser(monadMoneyParser);
  resourceServer.register(MONAD_NETWORK, evmServer);

  const routes = {
    "POST /task": {
      accepts: {
        scheme: "exact",
        network: MONAD_NETWORK,
        price: config.price,
        payTo: config.payTo,
      },
      description: config.description,
    },
  };

  const httpServer = new x402HTTPResourceServer(resourceServer, routes);
  await httpServer.initialize();

  return httpServer;
}
