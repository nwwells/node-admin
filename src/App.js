import React from 'react';
import { Breadcrumb, Header, Icon } from 'semantic-ui-react';
import { comparing, groupByNearest } from './utils';

import events from './events';
import './App.css';

const HOUR_IN_MILLIS = 1000 * 60 * 60;
const DAY_IN_HOURS = 24;
const DAY_IN_MILLIS = HOUR_IN_MILLIS * DAY_IN_HOURS;
const HOUR_LIST = [...Array(24).keys()].map(it => it + 1).reverse();
const GRAPH_WIDTH_PX = 640;
const GRAPH_PX_PER_HOUR = GRAPH_WIDTH_PX / DAY_IN_HOURS;

function hours() {
  const mostRecentHour = new Date().getUTCHours();
  return HOUR_LIST.map(it => (it + mostRecentHour) % 24);
}

const getYs = val => {
  if (val % 6 === 0) return ['15', '65'];
  if (val % 2 === 0) return ['27', '53'];
  return ['35', '45'];
};

// millis + secs + mins projected into 640 px, where an hour is 26.666667px
const subHourOffset = now => {
  const offsetMs = now % HOUR_IN_MILLIS;
  const offsetPx = offsetMs / HOUR_IN_MILLIS * GRAPH_PX_PER_HOUR;
  return offsetPx;
};

const typeYPos = {
  warn: 69,
  error: 40,
  alert: 11,
};

const clusterIt = arr =>
  arr
    .map(logEvent => ({
      ...logEvent,
      x:
        (logEvent.timestamp.getTime() - (Date.now() - DAY_IN_MILLIS)) *
        (GRAPH_WIDTH_PX / DAY_IN_MILLIS),
    }))
    .reduce(groupByNearest('x', 16), []);

const App = () => (
  <div className="App">
    <div className="App-header">
      <Breadcrumb size="huge">
        {/* <Breadcrumb.Section link>Home</Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section link>Registration</Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" /> */}
        <Breadcrumb.Section active>System Status</Breadcrumb.Section>
      </Breadcrumb>
    </div>
    <div className="App-main">
      <div className="App-page">
        <Header as="h1">System Events - Last 24 Hours</Header>
        <div className="SystemEvents-graph">
          <div className="SystemEvents-graph-overlay">
            <Icon className="SystemEvents-graph-alerts" size="large" name="alarm" color="red">
              <div className="SystemEvents-graph-iconLabel">Alerts</div>
            </Icon>
            <Icon
              className="SystemEvents-graph-errors"
              size="large"
              name="remove circle"
              color="orange"
            >
              <div className="SystemEvents-graph-iconLabel">Errors</div>
            </Icon>
            <Icon
              className="SystemEvents-graph-warnings"
              size="large"
              name="warning sign"
              color="yellow"
            >
              <div className="SystemEvents-graph-iconLabel">Warnings</div>
            </Icon>
          </div>
          <div className="SystemEvents-graph-svgContainer">
            <svg height="7rem" width="40rem">
              <g>
                {hours().map((hour, idx) => {
                  // hours() gives us the list of hours sorted from most recent to least.
                  // Oy, don't run offset for every row!

                  // x is defined as 24 - index of the given hour projected on 640 px, minus the
                  // offset of the remainder time when you mod out hours and above
                  const x = `${(DAY_IN_HOURS - idx) * GRAPH_PX_PER_HOUR -
                    subHourOffset(Date.now())}`;

                  // length of hour line is determined by mod 6, or mod 2. That is to say,
                  // every quarter day gets a long line and every other hour gets a medium one
                  const [y1, y2] = getYs(hour);

                  const style = { stroke: 'rgb(196,196,196)', strokeWidth: 1 };
                  const props = { x1: x, x2: x, y1, y2, style };
                  return (
                    <g key={hour}>
                      <line {...props} />
                      {hour % 6 === 0 && (
                        <text x={x} y={100} textAnchor="middle">
                          {hour}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
              <g>
                {(() => {
                  const eventsByType = events()
                    .sort(comparing('type', 'timestamp'))
                    .reduce((acc, it) => {
                      // add this type if it doesn't exist, copying the object for immutability
                      const res = acc[it.type] ? acc : { ...acc, [it.type]: [] };
                      res[it.type].push(it);
                      return res;
                    }, {});
                  return Object.keys(eventsByType).map(type => (
                    <g key={type}>
                      {clusterIt(eventsByType[type]).map(cluster => {
                        const isGroup = cluster.values.length > 1;
                        return (
                          <g>
                            <circle
                              key={cluster.x}
                              cx={cluster.x}
                              cy={typeYPos[type]}
                              r={isGroup ? '8' : '5'}
                            />
                            {isGroup && (
                              <text
                                x={cluster.x}
                                y={typeYPos[type] + 5}
                                textAnchor="middle"
                                fill="white"
                              >
                                {cluster.values.length}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  ));
                })()}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;
