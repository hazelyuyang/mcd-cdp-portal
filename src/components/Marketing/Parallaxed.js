import React from 'react';
import Plx from 'react-plx';

const Parallaxed = ({ children, ...props }) => {
  return (
    <Plx
      parallaxData={[
        {
          start: 0,
          duration: 1000,
          properties: [
            {
              startValue: 0,
              endValue: 100,
              property: 'translateY'
            }
          ],
          ...props
        }
      ]}
    >
      {children}
    </Plx>
  );
};

export default Parallaxed;
