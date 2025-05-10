import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetAllocationChart = ({ categories }) => {
  const data = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => cat.estimatedExpense || 0),
        backgroundColor: [
          '#FF6384', // pink
          '#36A2EB', // blue
          '#FFCE56', // yellow
          '#4BC0C0', // teal
          '#9966FF', // purple
          '#FF9F40', // orange
          '#8DFF33', // lime green
          '#FF33E3', // magenta
          '#33FFF6', // light cyan
          '#3375FF', // deep blue
          '#FF3333', // bright red
          '#33FF57', // green
          '#FFD700', // gold
          '#A52A2A', // brown
          '#708090', // slate gray
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Monthly Budget Allocation',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>Budget Allocation by Category</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default BudgetAllocationChart; 