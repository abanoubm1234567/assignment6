import React, { Component } from "react";
import * as d3 from "d3";
import './Child1.css'

class Child1 extends Component {
  state = { 
    
  };

  componentDidMount() {

  }

  componentDidUpdate() {
    //console.log('update')
    console.log(this.props.csv_data);

   // const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; // Use this data to create radio button
    //const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown

    const margin = { top: 70, right: 60, bottom: 100, left: 80 };
    const width = 400;
    const height = 600;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
   //var test = new Date("2024-12-02");
    //console.log(test.getMonth())

    var data = this.props.csv_data;
    
    var xScale = d3.scaleTime().domain(d3.extent(data, (d) => d.Date)).range([0, innerWidth]);

    const maxSum = d3.sum([
      d3.max(data, d => d.GPT_4),
      d3.max(data, d => d.Gemini),
      d3.max(data, d => d.PaLM_2),
      d3.max(data, d => d.Claude),
      d3.max(data, d => d.LLaMA_3_1),
    ]);
    //console.log(allTimeMax)
    //var allTimeMin = d3.min(data, d => d.GPT_4 + d.Gemini + d.PaLM_2 + d.Claude + d.LLaMA_3_1);
    //console.log(allTimeMin)
    console.log(maxSum);
    //NEED TO FIX LATER
   var yScale = d3.scaleLinear().domain([0, maxSum]).range([innerHeight, 0]);

    const svg = d3.select(".chart-container").select("svg")
            .attr("width", width)
            .attr("height", height)
            .select("g")
            .attr("transform", `translate(${margin.left},${margin.top-10})`);

    //console.log(data)

    svg.selectAll(".x-axis").data([0]).join("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight+25})`).attr('margin-top',20).call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')));
    //svg.selectAll(".y-axis").data([null]).join("g").attr("class", "y-axis").attr("transform", `translate(0,0)`).call(d3.axisLeft(yScale).tickFormat(d => isNaN(d) ? "" : `$${d.toFixed(2)}`));
    

    var colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];

    var stack = d3.stack().order(d3.stackOrderNone).keys(['GPT_4','Gemini', 'PaLM_2', 'Claude', 'LLaMA_3_1',  ]).offset(d3.stackOffsetWiggle);
    
    var stackedSeries = stack(data);

    console.log(stackedSeries);

    var areaGenerator = d3.area().x(d => xScale(d.data.Date)).y0(d => yScale(d[0])).y1(d => yScale(d[1])).curve(d3.curveCardinal);

    d3.select('.container').selectAll('path').data(stackedSeries).join('path').style('fill', (d, i) => colors[i]).attr('d', d=>areaGenerator(d));

  /*
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');
  */

   // const legend = svg.select('.legend');

    //legend.selectAll('p').join('rect').attr('height',50).attr('width',50);

  }

  render() {
    
    return (
      <div className="child1">
        <svg className="mySvg" width={400} height={600}>
          <g className="container">
          </g>
        </svg>
      </div>
    );
  }
}


export default Child1;

/*
 <div className="legend">
          <div className="legend1">
            <svg width={15} height={15}>
              <rect width={15} height={15} className="openRect"></rect>
            </svg>
            <p>Open</p>
          </div>
          <div className="legend1">
            <svg width={15} height={15}>
              <rect width={15} height={15} className="closeRect"></rect>
            </svg>
            <p>Close</p>
          </div>
        </div>
*/