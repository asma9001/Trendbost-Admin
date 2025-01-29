import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import Paper from '@mui/material/Paper';


const AnimatedRevenue = ({ platform, revenue }) => {
  const props = useSpring({
    from: { number: 0 },
    number: revenue,
    delay: 200,
    config: { duration: 1000 },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        textAlign: 'center',
        flex: 1,
      }}
    >
      <h3>{platform}</h3>
      <animated.p style={{ fontSize: '24px', margin: 0 }}>
        {props.number.to((n) => `$${n.toFixed(0)}`)}
      </animated.p>
      <p style={{ fontSize: '12px', color: 'gray' }}>Revenue</p>
    </Paper>
  );
};

export default AnimatedRevenue;