import AddWorkButton from "./components/navbar";
import RecentWork from "./components/recent-work";
import dbConnect from "./lib/dbConnect";
import { Work } from "./models/schema";
import Logo from "./components/Logo";
export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const result = await Work.aggregate([
    { $match: { status: "Pending" } },
    {
      $group: {
        _id: null,
        totalPendingAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalPendingAmount = result[0]?.totalPendingAmount || 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="page-header border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Vishwakarma
            </h1>
            <span className="text-xs font-semibold text-blue-600 tracking-[0.2em] uppercase">
              Engineering
            </span>
          </div>
        </div>
        <AddWorkButton />
      </div>

      {/* Stat Card */}
      <div className="px-4 md:px-6 py-6">
        <div className="stat-card max-w-sm">
          <p className="stat-card-label">Total Pending Amount</p>
          <p className="stat-card-value">
            ₹{totalPendingAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Company Summary Table */}
      <div className="px-4 md:px-6 pb-8">
        <RecentWork />
      </div>
    </main>
  );
}
