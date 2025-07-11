import AddWorkButton from "./components/navbar";
import RecentWork from "./components/recent-work";
import dbConnect from "./lib/dbConnect";
import { Work } from "./models/schema";

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
    <main className="">
      <div className="flex flex-row justify-between items-center md:px-4 px-3 md:pt-8 pt-4">
        <h1 className="md:text-3xl text-xl font-bold text-center py-4 rounded-br-md rounded-bl-md text-shadow-lg/20 text-shadow-blue-500/30">
          Workshop Management
        </h1>
        <AddWorkButton />
      </div>
      <div className="font-bold text-lg text-gray-400 px-4">
        Total Pending Amount:{" "}
        <span className="text-black font-bold ">₹{totalPendingAmount}</span>
      </div>

      <RecentWork />
    </main>
  );
}
