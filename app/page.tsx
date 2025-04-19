import Navbar from "./components/navbar";
// import PieChart from "./components/pie-chart";
import RecentWork from "./components/recent-work";

export default function Home() {
  // const pieData = [
  //   { label: "Paid", value: 40, color: "#3875eb" },
  //   { label: "Unpaid", value: 30, color: "#4848ff" },
  // ];
  return (
    <main className="">
      <h1 className="text-3xl font-bold text-center bg-[#2A7B9B] text-white py-4 rounded-br-md rounded-bl-md">
        Workshop Management
      </h1>
      <Navbar />

      {/* pichart for paid and upaid*/}
      {/* <PieChart data={pieData} /> */}

      {/* table  */}
      <RecentWork />
    </main>
  );
}
