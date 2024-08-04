import React from "react";
import Header from "./Header";
import Row from "./Row";
import LoadingSpinner from "../UIElements/LoadingSpinner";

import "./Table.css";

/* list of props table:
page enviamos toda la data 
headerTable los titulos del encabezado de la tabla
headerModalKeys Que dato o datos queremos mostrar como encabezado del modal
labelsModal object with the same keys of our collection but with the labels as a values.
statusType M de matriculado o A de activo 
tableKeys osea que datos queremos mostrar en la tabla (Array)
tableType es mas que todo para configurar nuestros links
*/
const AlumnoTable = (props) => {
  return (
    <div className="table100 ver2 m-b-110">
      <div className="table100-head">
        <table>
          <thead>
            <Header header={props.headerTable} />
          </thead>
        </table>
      </div>

      <div
        className="table100-body js-pscroll"
        style={{ position: "relative" }}
      >
        {props.isLoading && <LoadingSpinner asOverlay />}
        <table>
          <tbody>
            {props.page.map((row) => (
              <Row
                nItems={props.headerTable.length}
                key={row._id}
                row={row}
                headerModal={props.headerModalKeys
                  .map((key) => row[key])
                  .join(" ")}
                labelsModal={props.labelsModal}
                statusType={props.statusType}
                tableKeys={props.tableKeys}
                tableType={props.tableType}
                onChangeStatus={props.onChangeStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumnoTable;
