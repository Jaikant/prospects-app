import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleTime, scaleOrdinal } from 'd3-scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line, Circle } from '@visx/shape';
import { Tooltip, useTooltip } from '@visx/tooltip';
import { extent, max } from 'd3-array'; // Import directly from d3-array
import { timeFormat } from 'd3-time-format';

const width = 1200;
const height = 500;
const margin = { top: 40, right: 40, bottom: 60, left: 120 };

const formatDate = timeFormat('%b %d, %Y');

const Timeline = ({ data }) => {
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip();

  const allEvents = useMemo(
    () =>
      data.flatMap((person) => [
        ...person.prospectEntries.map((pe) => ({
          type: 'prospect',
          date: new Date(pe.createdAt),
          program: pe.program,
          personName: person.name,
        })),
        // ...person.prospectEntries.flatMap((pe) =>
        //   pe.callRecords.map((cr) => ({
        //     type: 'call',
        //     date: new Date(cr.calledAt),
        //     program: pe.program,
        //     personName: person.name,
        //   }))
        // ),
        ...person.enrollments.map((e) => ({
          type: 'enrollment',
          date: new Date(e.createdAt),
          program: e.program,
          personName: person.name,
        })),
      ]),
    [data]
  );

  const timeScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(allEvents, (d) => d.date))
        .range([margin.left, width - margin.right]),
    [allEvents]
  );

  const colorScale = scaleOrdinal()
        .domain(['prospect', 'call', 'enrollment'])
        .range(['#4299e1', '#f6ad55', '#48bb78']);

  const yScale = useMemo(
    () =>
      scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(data.map((_, i) => (i * (height - margin.top - margin.bottom)) / data.length + margin.top)),
    [data]
  );

  return (
    <div>
      <br />

      <svg width={width} height={height} style={{ backgroundColor: '#f3f3f3' }}>
        <Group>
          {data.map((person, personIndex) => {
            const y = yScale(person.name);
            return (
              <Group key={person.personId} top={y}>
                <Line from={{ x: margin.left, y: 0 }} to={{ x: width - margin.right, y: 0  }} stroke="#e2e8f0" strokeWidth={3} />
                {person.prospectEntries.map((event, eventIndex) => {
                  const x = timeScale(new Date(event.createdAt));
                  console.log(`event is ${JSON.stringify(event)}`);
                  return (
                    <g key={eventIndex}>
                      <Circle
                        cx={x}
                        cy={0}
                        r={6}
                        fill={colorScale('prospect')}
                        onMouseEnter={() => {
                          showTooltip({
                            tooltipData: {
                              type: "Prospect",
                              program: event.program.title,
                              programType: event.program.programType,
                              date: formatDate(new Date(event.createdAt)),
                            },
                            tooltipLeft: x,
                            tooltipTop: y,
                          });
                        }}
                        onMouseLeave={() => hideTooltip()}
                      />
                    </g>
                  );
                })}
                {person.enrollments.map((event, eventIndex) => {
                  const x = timeScale(new Date(event.createdAt));
                  console.log(`event is ${JSON.stringify(event)}`);
                  return (
                    <g key={eventIndex}>
                      <Circle
                        cx={x}
                        cy={0}
                        r={6}
                        fill={colorScale('enrollment')}
                        onMouseEnter={() => {
                          showTooltip({
                            tooltipData: {
                              type: "Enrollment",
                              program: event.program.title,
                              programType: event.program.programType,
                              date: formatDate(new Date(event.createdAt)),
                            },
                            tooltipLeft: x,
                            tooltipTop: y,
                          });
                        }}
                        onMouseLeave={() => hideTooltip()}
                      />
                    </g>
                  );
                })}

                {/* {person.prospectEntries.flatMap((pe) =>
                  pe.callRecords.map((cr, crIndex) => {
                    const x = timeScale(new Date(cr.calledAt));
                    return (
                      <Circle
                        key={`call-${crIndex}`}
                        cx={x}
                        cy={0}
                        r={4}
                        fill={colorScale('call')}
                        onMouseEnter={() => {
                          showTooltip({
                            tooltipData: {
                              type: 'Call',
                              program: pe.program.title,
                              programType: pe.program.programType,
                              date: formatDate(new Date(cr.calledAt)),
                            },
                            tooltipLeft: x,
                            tooltipTop: y,
                          });
                        }}
                        onMouseLeave={() => hideTooltip()}
                      />
                    );
                  })
                )} */}
              </Group>
            );
          })}
          <AxisBottom top={height - margin.bottom} scale={timeScale} numTicks={10} tickFormat={formatDate} />
          <AxisLeft scale={yScale} left={margin.left} label="Persons" labelOffset={60} />
        </Group>
      </svg>
      {tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '5px',
            fontSize: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            borderRadius: '4px',
          }}
        >
          <div>
            <strong>{tooltipData.type}</strong>
          </div>
          <div>Program: {tooltipData.program}</div>
          <div>Type: {tooltipData.programType}</div>
          <div>Date: {tooltipData.date}</div>
        </Tooltip>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Timeline;
