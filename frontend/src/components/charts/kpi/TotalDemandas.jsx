import ReactECharts from "echarts-for-react";

export default function TotalDemandas() {
  const option = {
    title: {
      text: "DashCRT - Exemplo"
    },
    tooltip: {},
    xAxis: {
      data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
    },
    yAxis: {},
    series: [
      {
        name: "Vendas",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}