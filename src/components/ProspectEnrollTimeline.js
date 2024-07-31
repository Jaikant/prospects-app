import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { scaleTime, scaleOrdinal, scaleBand } from 'd3-scale';
import { AxisBottom } from '@visx/axis';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text'; // Import Text from @visx/text
import { timeFormat } from 'd3-time-format';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';

const width = 1200;
const height = 500;
const margin = { top: 40, right: 40, bottom: 60, left: 120 };
const xPadding = 24; // Padding on either side of the x-axis

const formatDate = timeFormat('%b %d, %Y');

function wrapText(text, width) {
  text = text.split(' ');
  let line = '';
  let lines = [];
  for (let i = 0; i < text.length; i++) {
    let testLine = line + text[i] + ' ';
    if (testLine.length > width) {
      lines.push(line);
      line = text[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}

const ProspectEnrollmentTimeline = ({ data }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);


  const allEvents = useMemo(
    () => [
      ...data.prospectEntries.map((pe) => ({
        type: 'prospect',
        date: new Date(pe.createdAt),
        program: pe.program,
      })),
      ...data.enrollments.map((e) => ({
        type: 'enrollment',
        date: new Date(e.createdAt),
        program: e.program,
      })),
    ],
    [data]
  );

  const eventsByDate = useMemo(() => {
    const grouped = {};
    allEvents.forEach((event) => {
      const dateStr = event.date.toDateString();
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    });
    return grouped;
  }, [allEvents]);

  const timeScale = useMemo(() => {
    if (width === 0) return null;
    const dates = allEvents.map((d) => d.date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Add a small buffer to min and max dates
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);

    return scaleTime()
      .domain([minDate, maxDate])
      .range([margin.left + xPadding, width - margin.right - xPadding]);
  }, [allEvents, width]);

  const tickValues = useMemo(() => {
    if (!timeScale) return [];

    const range = timeScale.domain();
    const [start, end] = range;
    const dayCount = timeDay.count(start, end);
    
    let tickInterval;
    if (dayCount <= 60) {
      tickInterval = timeDay.every(1);  // Daily ticks
    } else if (dayCount <= 180) {
      tickInterval = timeDay.every(3);  // Every 3 days
    } else if (dayCount <= 365) {
      tickInterval = timeWeek.every(1);  // Weekly ticks
    } else if (dayCount <= 365 * 2) {
      tickInterval = timeMonth.every(1);  // Monthly ticks
    } else {
      tickInterval = timeMonth.every(3);  // Quarterly ticks
    }

    return timeScale.ticks(tickInterval);
  }, [timeScale]);


  const colorScale = scaleOrdinal().domain(['prospect', 'call', 'enrollment']).range(['#4299e1', '#f6ad55', '#48bb78']);

  const bandScale = scaleBand()
    .domain([data.name])
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // const barWidth = 150; // Increased bar width to accommodate text
  const barWidth = Math.min(150, (width - margin.left - margin.right) / 10); // Adjust bar width based on available space
  // const maxLineWidth = 25; // Maximum characters per line
  const maxLineWidth = Math.floor(barWidth / 7); // Approximate characters that fit in the bar width
  const numTicks = Math.max(2, Math.floor(width / 5)); // Adjust 200 to change tick density

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {width > 0 && (
        <svg width={width} height={height} style={{ backgroundColor: '#f3f3f3' }}>
          <Group>
            {Object.entries(eventsByDate).map(([dateStr, events]) => {
              const x = timeScale(new Date(dateStr));
              const y = bandScale(data.name);
              const barHeight = bandScale.bandwidth();

              return events.map((event, eventIndex) => {
                const eventType = event.type === 'prospect' ? 'Prospect' : 'Enrollment';
                const programTitle = event.program.title;
                const wrappedTitle = wrapText(programTitle, maxLineWidth);

                // Offset x position for multiple events on the same date
                const xOffset = (eventIndex - (events.length - 1) / 2) * (barWidth + 10);

                return (
                  <Group key={`${dateStr}-${eventIndex}`}>
                    <Bar x={x + xOffset - barWidth / 2} y={y} width={barWidth} height={barHeight} fill={colorScale(event.type)} />
                    <Text x={x + xOffset - barWidth / 2 + 5} y={y + 15} fontSize={10} fill="white">
                      {eventType}
                    </Text>
                    {wrappedTitle.map((line, i) => (
                      <Text key={i} x={x + xOffset - barWidth / 2 + 5} y={y + 30 + i * 12} fontSize={10} fill="white">
                        {line}
                      </Text>
                    ))}
                    <Text x={x + xOffset - barWidth / 2 + 5} y={y + barHeight - 10} fontSize={10} fill="white">
                      {formatDate(event.date)}
                    </Text>
                  </Group>
                );
              });
            })}
            <AxisBottom 
              top={height - margin.bottom} 
              scale={timeScale} 
              numTicks={numTicks} 
              tickFormat={formatDate} 
              tickValues={tickValues}
              // tickLabelProps={() => ({
              //   angle: 45,
              //   textAnchor: 'start',
              //   dy: '0.33em',
              //   dx: '0.33em',
              //   fontSize: 10,
              // })}
              />
          </Group>
        </svg>
      )}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Person Details</h3>
        <br/>
        <p>
          <strong>Name:</strong> {data.name}{' '}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Mobile:</strong> {data.mobile}
        </p>
        <p>
          <strong>Country:</strong> {data.country}
        </p>
        <p>
          <strong>State:</strong> {data.state}
        </p>
        <p>
          <strong>City:</strong> {data.city}
        </p>
      </div>
    </div>
  );
};

export default ProspectEnrollmentTimeline;
