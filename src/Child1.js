import React, { Component } from "react";
import * as d3 from "d3";
import './Child1.css'

class Child1 extends Component {
  state = { 
    
  };

  componentDidMount() {

  }

  componentDidUpdate() {
    //console.log(this.props.csv_data);
  
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
  
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(250, 250, 250, 0.9)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    var stack = d3.stack()
      .order(d3.stackOrderNone)
      .keys([  'LLaMA_3_1', 'Claude','PaLM_2','Gemini','GPT_4',])
      .offset(d3.stackOffsetWiggle);
  
    var stackedSeries = stack(data);
    //console.log(stackedSeries)

    var areaGenerator = d3.area()
      .x(d => xScale(d.data.Date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCardinal);
  
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const colorsToCompany = {
        'LLaMA_3_1': colors[0], 'Claude': colors[1],'PaLM_2': colors[2],'Gemini':colors[3],'GPT_4':colors[4],
      }
    
    container.selectAll('path')
      .data(stackedSeries)
      .join('path')
      .style('fill', (d, i) => colors[i])
      .attr('d', d => areaGenerator(d))
      .on('mouseover', function(event, d) {
        //console.log(data)
        var barData = data.map(dataSet=> ({
          mon: months[dataSet.Date.getMonth()],
          num: dataSet[d.key]
        }))
        console.log(barData)
        console.log(d.key)

        tooltip.style('visibility', 'visible').html('');

        const barMargins = {
          top: 30, bottom: 30, right: 45, left: 40
        }

        const ttHeight = 200;
        const ttWidth = 300;

        var toolTipSVG = tooltip.append('svg').attr('class','tooltip-svg')
        .attr('height',ttHeight+barMargins.top + barMargins.bottom)
        .attr('width',ttWidth + barMargins.left + barMargins.right);

        const barContainer = toolTipSVG.join('g').attr("transform", `translate(${barMargins.left},${barMargins.top})`);

        var barXScale = d3.scaleBand().domain(barData.map(d => d.mon)).range([0,ttWidth]).padding(0.15);
        var barYScale = d3.scaleLinear().domain([0,d3.max(barData, d => d.num)]).range([ttHeight,0]);

        barContainer.selectAll(".bar-x-axis").data([null]).join('g').attr('class',"bar-x-axis")
          .attr("transform", `translate(${25},${ttHeight+21})`)
          .call(d3.axisBottom(barXScale)).attr('stroke','black').selectAll("path, line")
          .style("stroke", "black");
          
          
        barContainer.selectAll(".bar-y-axis").data([null]).join('g').attr('class',"bar-y-axis")
          .attr("transform", `translate(${25},${20})`)
          .call(d3.axisLeft(barYScale)).attr('stroke','black').selectAll("path, line")
          .style("stroke", "black");

        barContainer.selectAll('rect')
        .data(barData)
        .join('rect')
        .attr('x',d=>barXScale(d.mon))
        .attr('y',d=>barYScale(d.num))
        .attr('width', barXScale.bandwidth())
        .attr('height', d=> ttHeight - barYScale(d.num))
        .attr('fill',colorsToCompany[d.key])
        .attr("transform", `translate(${25},${20})`)

      })
      .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY + 10) + 'px').style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
      });

      const legendData = ['GPT-4', 'Gemini', 'PaLM-2', 'Claude',  'LLaMA-3.1'];

      const legend = d3.select('.legend')
        .selectAll('.legend-item')
        .data(legendData)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d,i) =>`translate( 0,${i*23})`);
      
      legend.selectAll('rect')
        .data(d => [d]) 
        .join('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', (d, i) => colors[4-legendData.indexOf(d)]);
      
      legend.selectAll('text')
        .data(d => [d])
        .join('text')
        .attr('x', 30)
        .attr('y', 15) 
        .text(d => d)

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
        <svg className="legend" width={200} height={120}>
         </svg>
      </div>
    );
  }
}


export default Child1;


 
