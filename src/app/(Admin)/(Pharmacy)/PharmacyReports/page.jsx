"use client";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export default function PharmacyReports() {
  // Sample sales data
  const salesData = [
    { id: 1, date: '2024-08-01', medicine: 'Aspirin', quantity: 10, total: 50 },
    { id: 2, date: '2024-08-02', medicine: 'Paracetamol', quantity: 5, total: 25 },
    { id: 3, date: '2024-08-03', medicine: 'Amoxicillin', quantity: 7, total: 70 },
    { id: 4, date: '2024-08-04', medicine: 'Ibuprofen', quantity: 8, total: 40 },
    { id: 5, date: '2024-08-05', medicine: 'Cough Syrup', quantity: 4, total: 20 },
  ];

  // Sample medicine data
  const medicineData = [
    { id: 1, name: 'Aspirin', quantity: 20, group: 'Pain Relievers' },
    { id: 2, name: 'Paracetamol', quantity: 5, group: 'Pain Relievers' },
    { id: 3, name: 'Amoxicillin', quantity: 10, group: 'Antibiotics' },
    { id: 4, name: 'Ibuprofen', quantity: 8, group: 'Pain Relievers' },
    { id: 5, name: 'Cough Syrup', quantity: 4, group: 'Cough & Cold' },
  ];

  // Prepare data for charts
  const dates = salesData.map(sale => sale.date);
  const totals = salesData.map(sale => sale.total);

  const salesByMedicine = medicineData.map(med => {
    const totalSales = salesData
      .filter(sale => sale.medicine === med.name)
      .reduce((sum, sale) => sum + sale.total, 0);
    return { name: med.name, totalSales };
  });

  const salesByMedicineData = {
    labels: salesByMedicine.map(item => item.name),
    datasets: [
      {
        label: 'Total Sales',
        data: salesByMedicine.map(item => item.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const medicineQuantityData = {
    labels: medicineData.map(med => med.name),
    datasets: [
      {
        data: medicineData.map(med => med.quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const salesOverTimeData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Sales',
        data: totals,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false, // Ensures charts are more compact
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <div className="flex top-0 w-full bg-gray-100 p-6 justify-between">
          <h1 className="text-2xl font-bold text-black">Pharmacy Management Report</h1>
        </div>

        {/* Main Content */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {/* Sales Over Time Graph */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sales Over Time</h2>
            <div className="h-64">
              <Line data={salesOverTimeData} options={chartOptions} />
            </div>
          </div>

          {/* Sales by Medicine Graph */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sales by Medicine</h2>
            <div className="h-64">
              <Bar data={salesByMedicineData} options={chartOptions} />
            </div>
          </div>

          {/* Medicine Quantity Distribution Pie Chart */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Medicine Quantity Distribution</h2>
            <div className="h-64">
              <Pie data={medicineQuantityData} options={chartOptions} />
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-2">Sales Table</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map(sale => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2">{sale.id}</td>
                    <td className="p-2">{sale.date}</td>
                    <td className="p-2">{sale.medicine}</td>
                    <td className="p-2">{sale.quantity}</td>
                    <td className="p-2">{sale.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
