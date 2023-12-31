import React from 'react';

interface NonAuthLayout {
  children: JSX.Element;
}

const NonAuthLayout = (props: NonAuthLayout) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default NonAuthLayout;
