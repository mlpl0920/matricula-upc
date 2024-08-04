import React from "react";

const Header = (props) => {
  return (
    <tr className="row100 head">
      {props.header.map((txt, i) => (
        <th key={i} style={{ width: `calc(100% / ${props.header.length})` }}>
          {txt}
        </th>
      ))}
    </tr>
  );
};

export default Header;
