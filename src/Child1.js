import React, { Component } from "react";
import * as d3 from "d3";
import './Child1.css'

class Child1 extends Component {
  state = { 
    
  };

  componentDidMount() {

  }

  componentDidUpdate() {
    console.log(this.props.csv_data);
  
    const margin = { top: 70, right: 60, bottom: 50, left: 80 };
    const width = 400;
    const height = 500;
  
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    var data = this.props.csv_data;
  
    var xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([0, innerWidth]);
  
    const maxSum = d3.sum([
      d3.max(data, d => d.GPT_4),
      d3.max(data, d => d.Gemini),
      d3.max(data, d => d.PaLM_2),
      d3.max(data, d => d.Claude),
      d3.max(data, d => d.LLaMA_3_1),
    ]);
  
    var yScale = d3.scaleLinear()
      .domain([0, maxSum])
      .range([innerHeight, 0]);
  
    const svg = d3.select(".chart-container").select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  
    const container = svg.select(".container")
      .attr("transform", `translate(${margin.left},0)`);
  
    svg.select(".x-axis")
      .attr("transform", `translate(${margin.left},${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')));
  
    const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];
  
    var stack = d3.stack()
      .order(d3.stackOrderNone)
      .keys(['GPT_4', 'Gemini', 'PaLM_2', 'Claude', 'LLaMA_3_1'])
      .offset(d3.stackOffsetWiggle);
  
    var stackedSeries = stack(data);
  
    var areaGenerator = d3.area()
      .x(d => xScale(d.data.Date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCardinal);
  
    container.selectAll('path')
      .data(stackedSeries)
      .join('path')
      .style('fill', (d, i) => colors[i])
      .attr('d', d => areaGenerator(d));

    var legend = d3.select('.legend')
      .selectAll('rect')
      .data(['GPT_4', 'Gemini', 'PaLM_2', 'Claude', 'LLaMA_3_1'])
      .join('rect')
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', (d, i) => colors[i])
      .attr('class', 'legend-item');
      
    legend.join('p')
      .text(d => d)  // Display the model name
      .style('margin-left', '5px')
      .style('display', 'inline-block')
      .style('vertical-align', 'middle');
  }
  
  

  render() {
    
    return (
      <div className="child1">
        <div className="chart-container">
          <svg className="mySvg" width={400} height={500}>
            <g className="container">
            </g>
            <g className="x-axis">
            </g>
          </svg>
        </div>

        <div className="legend">
         </div>
      </div>
    );
  }
}


export default Child1;


 
