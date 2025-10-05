"use client";

import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export default function TransferPage() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [showUSD, setShowUSD] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => setSolPrice(data.solana.usd))
      .catch(console.error);
  }, []);

  const isValidAmount = () => !isNaN(Number(amount)) && Number(amount) > 0;
  const isValidAddress = () => {
    try {
      new PublicKey(toAddress);
      return true;
    } catch {
      return false;
    }
  };

  const handleSend = async () => {
    if (!connected || !publicKey)
      return toast.error("Please connect your Phantom wallet");
    if (!isValidAmount())
      return toast.error("Enter a valid amount greater than 0");
    if (!isValidAddress()) return toast.error("Enter a valid Solana address");

    try {
      const connection = new Connection(
        `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toAddress),
          lamports: Number(amount) * 1e9,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      toast.success(`sent: ${signature}`);
      setAmount("");
      setToAddress("");
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">💸 Transfer SOL</h1>

      <WalletMultiButton className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" />

      <input
        type="text"
        placeholder="To Wallet Address"
        className="border p-2 rounded w-full mb-3"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount (in SOL)"
        className="border p-2 rounded w-full mb-3"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {showUSD && solPrice && isValidAmount() && (
        <p className="mb-2 text-gray-600">
          ≈ ${(Number(amount) * solPrice).toFixed(2)} USD
        </p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowUSD(!showUSD)}
          className="bg-gray-300 rounded p-2"
        >
          {showUSD ? "Hide USD" : "Show USD"}
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!connected}
        className={`w-full p-3 rounded text-white font-semibold ${
          connected
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Send SOL
      </button>
    </div>
  );
}
